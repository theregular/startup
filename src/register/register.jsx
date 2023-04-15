import React from 'react';
import { NavLink} from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { AuthState } from '../login/authState';
import './register.css';

export function Register({onAuthChange}) {
    const [usernameInput, setUsernameInput] = React.useState('');
    const [emailInput, setEmailInput] = React.useState('');
    const [passwordInput, setPasswordInput] = React.useState('');
    const [confirmPasswordInput, setConfirmPasswordInput] = React.useState('');
    const [redirect, setRedirect] = React.useState(false);
    const [msg, setMsg] = React.useState('');


    const usernameChange = (e) => {
        setUsernameInput(e.target.value.trim());
    };

    const emailChange = (e) => {
        setEmailInput(e.target.value.trim());
    };
    
    const passwordChange = (e) => {
        setPasswordInput(e.target.value.trim());
    };

    const confirmPasswordChange = (e) => {
        setConfirmPasswordInput(e.target.value.trim());
    };

    async function createUser() {
        const valid = validate(usernameInput, emailInput, passwordInput, confirmPasswordInput);
        if (valid === true) {
            const response = await fetch(`/api/auth/create`, {
                method: 'post',
                body: JSON.stringify({ username: usernameInput, password: passwordInput, email: emailInput}),
                headers: {
                  'Content-type': 'application/json; charset=UTF-8',
                },
            }).then((response) => {
                if (response?.status === 200) {
                  onAuthChange(usernameInput, AuthState.Authenticated);
                  localStorage.setItem('username', usernameInput); //store username cookie
                  //alert("Login success!");
                  setRedirect(true);
                }
                else {
                    setMsg('Username already in use');
                }
              });
            
              /*
            if (response?.status === 200) {
                //localStorage.setItem('userName', userName);
                //alert("success!")
                setRedirect(true);
              } else {
                setMsg('Username already in use');
              }
              */
        }
    }

    const handleKeyDown = (event) => {
        if (event.keyCode === 13) { //if enter key pressed
            createUser();
        }
    }

    function validate(username, email, password, confirmPassword) {

        if (!validateUsername(username)) {
            setMsg('Please enter a valid username');
            return false;
        }
    
        if (!isValidEmail(email)) {
            setMsg('Please enter a valid email address');
            return false;
        }
    
        if (!validatePassword(password)) {
            setMsg('Password must contain at least one number and one special character, and be at least 8 characters long');
            return false;
        }
    
        if (password !== confirmPassword) {
            setMsg('Passwords do not match');
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
    
    function validateUsername(username) {
        const regex = /^[a-z0-9]+$/i;
        return regex.test(username);
    }

    if (redirect) { //auto redirects to profile page when login successful
        return <Navigate to={`/profile/${usernameInput}`} replace={true}/>;
    }

    return (
        <main className='register-body'>
            <div className="register">
                    <form className="register-form">
                        <div id="registerTitle">register</div>
                        <input type="text" id="userName" value={usernameInput} placeholder="username" onKeyDown={handleKeyDown} onChange={usernameChange}/>
                        <input type="text" id="email" value={emailInput} placeholder="email" onKeyDown={handleKeyDown} onChange={emailChange} />
                        <input type="password" id="userPassword" value={passwordInput} placeholder="password" onKeyDown={handleKeyDown} onChange={passwordChange}/>
                        <input type="password" id="confirmPassword" value={confirmPasswordInput} placeholder="confirm password" onKeyDown={handleKeyDown} onChange={confirmPasswordChange} />
                        <div id="buttons">
                            <NavLink className= "button-navlink" id ="login" to="/login">login</NavLink>
                            <button id="register" onClick={() => createUser()} type="button">register</button>
                        </div>
                    </form>
                <div id="errMessage">{msg}</div>
            </div>
        </main>
    );
}