async function loginUser() {
  const usernameInput = document.querySelector('#userName').value.trim();
  const passwordInput = document.querySelector('#userPassword').value.trim();

  valid = validate(usernameInput, passwordInput);

  if (valid === true) {
    const response = await fetch(`/api/auth/login`, {
      method: 'post',
      body: JSON.stringify({ username: usernameInput, password: passwordInput }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });

    const body = await response.json();

    if (response?.status === 200) {
      localStorage.setItem('username', usernameInput);
      window.location.pathname = `/profile/${usernameInput}`;
    } else {
      valid = 'Incorrect username or password!';
    }
  }
  if (valid !== true){
    const errmsg = document.querySelector('#errMessage');
    errmsg.textContent = valid;
  }
}

function validate(username, password) {

  if (username === '') {
  return 'Please enter a username';
  }

  if (password === '') {
  return 'Please enter a password';
  }
  return true;
}

const username = document.querySelector('#userName');
const password = document.querySelector('#userPassword');
//enter key submission
username.addEventListener('keydown', enterSubmit);
password.addEventListener('keydown', enterSubmit);

function enterSubmit (event) {
  if (event.key === 'Enter') {
    //event.preventDefault();
    loginUser();
  }
}
