async function createUser() {
    //alert('You clicked register button');
    const usernameInput = document.querySelector('#userName').value.trim();
    const emailInput = document.querySelector('#email').value.trim();
    const passwordInput = document.querySelector('#userPassword').value.trim();
    const confirmPasswordInput = document.querySelector('#confirmPassword').value.trim();

    const valid = validate(usernameInput, emailInput, passwordInput, confirmPasswordInput);

    
    if (valid) {
        //alert('register accepted!');
        
        const response = await fetch(`/api/auth/create`, {
            method: 'post',
            body: JSON.stringify({ username: usernameInput, password: passwordInput, email: emailInput}),
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
        });
        const body = await response.json();
        
        if (response?.status === 200) {
            alert('register success');
            //localStorage.setItem('userName', userName);
            //window.location.href = "profile.html";
          } else {
            alert('register fail');
          }
    }
    
}

function validate(username, email, password, confirmPassword) {

    if (username === '') {
    alert('Please enter a username');
    return false;
    }

    if (!isValidEmail(email)) {
    alert('Please enter a valid email address');
    return false;
    }

    if (!validatePassword(password)) {
    alert('Password must contain at least one number and one special character, and be at least 8 characters long');
    return false;
    }

    if (password !== confirmPassword) {
    alert('Passwords do not match');
    return false;
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