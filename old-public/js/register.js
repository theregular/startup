async function createUser() {
    const usernameInput = document.querySelector('#userName').value.trim();
    const emailInput = document.querySelector('#email').value.trim();
    const passwordInput = document.querySelector('#userPassword').value.trim();
    const confirmPasswordInput = document.querySelector('#confirmPassword').value.trim();

    valid = validate(usernameInput, emailInput, passwordInput, confirmPasswordInput);

    if (valid === true) {
        const response = await fetch(`/api/auth/create`, {
            method: 'post',
            body: JSON.stringify({ username: usernameInput, password: passwordInput, email: emailInput}),
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
        });
        const body = await response.json();
        
        if (response?.status === 200) {
            localStorage.setItem('userName', userName);
            window.location.pathname = `/profile/${usernameInput}`;
          } else {
            valid = 'Username already in use'
          }
    }
    if (valid !== true){
        const errmsg = document.querySelector('#errMessage');
        errmsg.textContent = valid;
    }
}

function validate(username, email, password, confirmPassword) {

    if (!validateUsername(username)) {
    return 'Please enter a valid username';
    }

    if (!isValidEmail(email)) {
    return 'Please enter a valid email address';
    }

    if (!validatePassword(password)) {
    return 'Password must contain at least one number and one special character, and be at least 8 characters long';
    }

    if (password !== confirmPassword) {
    return 'Passwords do not match';
    }

    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    const regex = /^(?=.*[a-zA-Z])(?=.*[0-9!@#$%^&*])(?=.{8,})/;
    return regex.test(password);
}

function validateUsername(username) {
    const regex = /^[a-z0-9]+$/i;
    return regex.test(username);
}

const username = document.querySelector('#userName');
const email = document.querySelector('#email');
const password = document.querySelector('#userPassword');
const confirmPassword = document.querySelector('#confirmPassword');
//enter key submission
username.addEventListener('keydown', enterSubmit);
email.addEventListener('keydown', enterSubmit);
password.addEventListener('keydown', enterSubmit);
confirmPassword.addEventListener('keydown', enterSubmit);

function enterSubmit (event) {
    if (event.key === 'Enter') {
      //event.preventDefault();
      createUser();
    }
}