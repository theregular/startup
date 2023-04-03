//get username from local storage cookie //GET WORKING
/*
(async () => {
    let authenticated = false;
    const userName = localStorage.getItem('username');

    //find stored username in DB
    if (userName) {
      const user = await getUser(userName);
      authenticated = user?.authenticated;
    }
    
    //if already in local storage redirect to user's page (add authtoken confirmation?)
    if (authenticated) {
      window.location.pathname = `/profile/${userName}`;
    }
  })();
  */

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
      //alert('Login Succeeded!');
      localStorage.setItem('username', usernameInput);
      window.location.pathname = `/profile/${usernameInput}`;
    } else {
      //alert('Login failed!');
      valid = 'Incorrect username or password!';
      /*
      const modalEl = document.querySelector('#msgModal');
      modalEl.querySelector('.modal-body').textContent = `⚠ Error: ${body.msg}`;
      const msgModal = new bootstrap.Modal(modalEl, {});
      msgModal.show();
      */
    }
  }
  if (valid !== true){
    const errmsg = document.querySelector('#errMessage');
    errmsg.textContent = valid;
  }
}

function validate(username, password) {

  if (username === '') {
  //alert('Please enter a username');
  return 'Please enter a username';
  }

  if (password === '') {
  //alert('Please enter a password');
  return 'Please enter a password';
  }

  return true;
}



/*
document.getElementById("login").addEventListener("click", displayMessage);


function displayMessage() {
    alert ("Loggin You In, Please Wait")
}
*/
 