async function addUserRating() {
    //get selected rating
    const selectedValue = document.querySelector('.rating input:checked').value;
    const actualValue = 6 - selectedValue; //flip the number because the stars are reversed
    //console.log(`rating is ${actualValue}`);

    const usernameValue = document.querySelector('.username').textContent;
    const username = usernameValue.substring(1);
    const ratingEl = document.querySelector('.rating-text');
    //ratingEl.textContent = `You rated ${username} ${actualValue}`;

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
}

async function leaveReview() { //TODO: limit reviews?
  const leaveReviewBtn = document.getElementById('reviewButton');
  const reviewBox = document.getElementById('reviewText');
  const reviewBody = document.getElementById('reviews-body');
  const thankYouMsg = document.getElementById('thankYouMsg');
  const submitButton = document.getElementById('submitBtn');
  const usernameValue = document.querySelector('.username').textContent;
  const username = usernameValue.substring(1);
  //thankYouMsg.style.display = 'none';
  reviewBox.style.display = 'block';
  leaveReviewBtn.style.display = 'none';
  submitButton.style.display = 'block';
  
  //on submit button click submit review
  submitButton.addEventListener('click', async function() {
    const reviewText = reviewBox.value.trim();
    valid = validate(reviewText);

    if(valid === true) {
      const response = await fetch('api/auth/addreview',  {
        method: 'post',
        body: JSON.stringify({ username: username, review: reviewText }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      
      if (response.status === 200) {
        alert('review accepted');
        thankYouMsg.textContent = 'Your review has been submitted!';

      } else {
        alert('could not upload review');
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
  }, { once: true }); //only adds the event listener once
}

async function getAverageRating() {

  //const rating = 'test';

  const usernameValue = document.querySelector('.username').textContent;
  const username = usernameValue.substring(1);
  
  const response = await fetch(`/api/auth/getavgrating`, {
    method: 'get',
    body: JSON.stringify({ username: username}),
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

function validate(input) {
  if (input === ""){
    return 'Please enter valid input';
  }
  return true;
}

//const avgRating = document.querySelector('#avgRating');
//document.querySelector('#avgRating').textContent = await getAverageRating();

//get rating input info
const ratingInputs = document.querySelectorAll('.rating input');

ratingInputs.forEach(input => {
    input.addEventListener('change', addUserRating);
});