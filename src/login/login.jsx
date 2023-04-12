import React from 'react';
import { NavLink} from 'react-router-dom';
import './login.css';

export function Login() {

    const [usernameInput, setUsernameInput] = React.useState('');
    const [passwordInput, setPasswordInput] = React.useState('');
    let [valid, setValid] = React.useState('');

    const usernameChange = (e) => {
        setUsernameInput(e.target.value.trim());
    };
    
    const passwordChange = (e) => {
        setPasswordInput(e.target.value.trim());
    };

    async function loginUser(){
        setValid(validate(usernameInput, passwordInput)); //is valid input or not?

        if (valid === true) {
            const response = await fetch(`/api/auth/login`, {
                method: 'post',
                body: JSON.stringify({ username: usernameInput, password: passwordInput }),
                headers: {
                  'Content-type': 'application/json; charset=UTF-8',
                },
              });

            if (response?.status === 200) {
                //localStorage.setItem('username', usernameInput);
                alert("Login success!");
            } 
            else {
                
                setValid('Incorrect username or password!');
            }
        }
        if (valid !== true){
            /*
            const errmsg = document.querySelector('#errMessage');
            errmsg.textContent = valid;
            */
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

    return (
        <main className='login-body'>
            <div className="login">
                <form>
                    <div id="loginTitle">login</div>
                    <input type="text" id="userName" placeholder="username" onChange={usernameChange}/>
                    <input type="password" id="userPassword" placeholder="password" onChange={passwordChange} />
                    
                    <div id="buttons">
                        <button id ="login" type="button" onClick={() => loginUser()}>login</button>
                        <NavLink className= "button-navlink" id ="register" to="/register">register</NavLink>
                    </div>
                </form>
                <div id="errMessage">{valid}</div>
            </div>
        </main>
    );
}