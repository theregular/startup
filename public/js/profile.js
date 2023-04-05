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
        ratingEl.textConten = 'Failed to add rating'
      }
}

function leaveReview() {
    const leaveReviewBtn = document.getElementById('reviewButton');
        const reviewStuff = document.getElementById('review-textbox');
        const reviewBody = document.getElementById('reviews-body');
        let textBox = 0;

        leaveReviewBtn.addEventListener('click', function() {
        if (textBox == 0) {
            const textArea = document.createElement('textarea');
            textArea.setAttribute('id', 'reviewText');
            textArea.type = 'text';
            textArea.maxLength = '100';
            reviewStuff.appendChild(textArea);
            textBox++;

        
            const submitButton = document.createElement('button');
            submitButton.setAttribute('id', 'submitBtn');
            submitButton.textContent = 'Submit';
            reviewBody.appendChild(submitButton);
            
            submitButton.addEventListener('click', function() {
                leaveReviewBtn.style.display = 'none';
                submitButton.style.display = 'none';
                textArea.style.display = 'none';
                const thankYouMsg = document.createElement('p');
                thankYouMsg.textContent = 'Your review has been submitted!';
                reviewBody.appendChild(thankYouMsg);
            });
        }});
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

//const avgRating = document.querySelector('#avgRating');
//document.querySelector('#avgRating').textContent = await getAverageRating();

//get rating input info
const ratingInputs = document.querySelectorAll('.rating input');

ratingInputs.forEach(input => {
    input.addEventListener('change', addUserRating);
});