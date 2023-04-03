async function createUser() {
    //alert('You clicked register button');
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
            //alert('register success');
            localStorage.setItem('userName', userName);
            window.location.pathname = `/profile/${usernameInput}`;
          } else {
            //alert('register fail');
            valid = 'Username already in use'
          }
    }
    if (valid !== true){
        const errmsg = document.querySelector('#errMessage');
        errmsg.textContent = valid;
    }
}

function validate(username, email, password, confirmPassword) {

    if (username === '') {
    //alert('Please enter a username');
    return 'Please enter a username';
    }

    if (!isValidEmail(email)) {
    //alert('Please enter a valid email address');
    return 'Please enter a valid email address';
    }

    if (!validatePassword(password)) {
    //alert('Password must contain at least one number and one special character, and be at least 8 characters long');
    return 'Password must contain at least one number and one special character, and be at least 8 characters long';
    }

    if (password !== confirmPassword) {
    //alert('Passwords do not match');
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