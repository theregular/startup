async function addUserRating() {
    //get selected rating
  const selectedValue = document.querySelector('.rating input:checked').value;
  const actualValue = 6 - selectedValue; //flip the number because the stars are reversed
  const usernameValue = document.querySelector('.username').textContent;
  const username = usernameValue.substring(1);
  const ratingEl = document.querySelector('.rating-text');
  const avgRatingEl = document.querySelector('#avgRating');

  // make readonly
  ratingInputs.forEach(input => {
  input.disabled = true;
  });

  //add to DB
  const response = await fetch(`/api/auth/addrating`, {
    method: 'post',
    body: JSON.stringify({ username: username, rating: actualValue }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });
  
  //const body = await response.json();
  
  if (response.status === 200) {
    //alert("added rating to DB successfully");\
    ratingEl.textContent = `You rated ${username} ${actualValue}`;
  } else {
    ratingEl.textContent = 'Failed to add rating';
  }

  //update new average rating
  const newAvg = await getAverageRating(username);
  avgRatingEl.textContent = await newAvg;

  //update DB with new average rating
  await updateAvgRating(username, newAvg);

  //update rank
  await getRank(username);
}

async function getRank(username) {
  const rankText = document.getElementById('rank');

  const response = await fetch(`/api/auth/getrank/${username}`, {
    method: 'get',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });
  const body = await response.json();

  if (response.status === 200) {
    rankText.textContent = body.rank;
  }
  else {
    alert('ERROR');
  }
  //return 'ERROR';
}

async function updateAvgRating(username, rating) {
  const response = await fetch(`/api/auth/updateavg`, {
    method: 'post',
    body: JSON.stringify({ username: username, avgRating: rating }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });

  if (response.status === 200) {
    //alert("new avg rating stored!");
  } else {
    alert('could not store rating');
  }
}

async function getAverageRating(username) {
  
  const response = await fetch(`/api/auth/getavgrating/${username}`, {
    method: 'get',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });

  const body = await response.json();

  if (response.status === 200) {
    return body.avgRating;
  }

  return 'ERROR';
}

function leaveReview() { //TODO: limit reviews?
  //shows text box and submit button so review can be left
  const leaveReviewBtn = document.getElementById('reviewButton');
  const reviewBox = document.getElementById('reviewText');
  const submitButton = document.getElementById('submitBtn');
  reviewBox.style.display = 'block';
  leaveReviewBtn.style.display = 'none';
  submitButton.style.display = 'block';
}


async function submitReview(){
  const leaveReviewBtn = document.getElementById('reviewButton');
  const submitButton = document.getElementById('submitBtn');
  const thankYouMsg = document.getElementById('thankYouMsg');
  const usernameValue = document.querySelector('.username').textContent;
  const username = usernameValue.substring(1);
  const reviewBox = document.getElementById('reviewText');
  const reviewText = reviewBox.value.trim();
  valid = validate(reviewText);
  if(valid === true) {
    const response = await fetch(`/api/auth/addreview`, {
      method: 'post',
      body: JSON.stringify({ username: username, review: reviewText }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });

    if (response.status === 200) {
      //alert('review accepted');
      thankYouMsg.textContent = 'Your review has been submitted!';

    } else {
      //alert('could not upload review');
      thankYouMsg.textContent = 'Error';
    }
    leaveReviewBtn.style.display = 'block';
    submitButton.style.display = 'none';
    reviewBox.style.display = 'none';
    reviewBox.value = "";
    thankYouMsg.style.display = 'block;'
  }
  else {
    alert(valid);
  }
}


function validate(input) {
  if (input === ""){
    return 'Please enter valid input';
  }
  return true;
}

function test() {
  alert('settings test');
}

//const avgRating = document.querySelector('#avgRating');
//document.querySelector('#avgRating').textContent = await getAverageRating();

//get rating input info
const ratingInputs = document.querySelectorAll('.rating input');

ratingInputs.forEach(input => {
    input.addEventListener('change', addUserRating);
});