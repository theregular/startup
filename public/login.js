/*(async () => {
    let authenticated = false;
    const userName = localStorage.getItem('userName');
    if (userName) {
      const nameEl = document.querySelector('#userName');
      nameEl.value = userName;
      const user = await getUser(nameEl.value);
      authenticated = user?.authenticated;
    }
    
  
    if (authenticated) {
      document.querySelector('#playerName').textContent = userName;
      setDisplay('loginControls', 'none');
      setDisplay('playControls', 'block');
    } else {
      setDisplay('loginControls', 'block');
      setDisplay('playControls', 'none');
    }
    
  })();
  */
async function loginUser() {
  //alert("You clicked login button")
  const usernameInput = document.querySelector('#userName').value.trim();
  const passwordInput = document.querySelector('#userPassword').value.trim();
  //alert(usernameInput + " " + passwordInput);

  valid = validate(usernameInput, passwordInput);

  if (valid) {
    const response = await fetch(`/api/auth/login`, {
      method: 'post',
      body: JSON.stringify({ username: usernameInput, password: passwordInput }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });

    const body = await response.json();

    if (response?.status === 200) {
      alert('Login Succeeded!');
      //ocalStorage.setItem('userName', userName);
      //window.location.href = `/profile/${userName}`;
      window.location.pathname = `/profile/${usernameInput}`;
    } else {
      alert('Login failed!');
      /*
      const modalEl = document.querySelector('#msgModal');
      modalEl.querySelector('.modal-body').textContent = `⚠ Error: ${body.msg}`;
      const msgModal = new bootstrap.Modal(modalEl, {});
      msgModal.show();
      */
    }
  }
}

function validate(username, password) {

  if (username === '') {
  alert('Please enter a username');
  return false;
  }

  if (password === '') {
  alert('Please enter a password');
  return false;
  }

  return true;
}
  


/*
document.getElementById("login").addEventListener("click", displayMessage);


function displayMessage() {
    alert ("Loggin You In, Please Wait")
}
*/
 