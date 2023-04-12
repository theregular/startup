import React from 'react';
import { NavLink} from 'react-router-dom';
import './register.css';

export function Register() {
    const [usernameInput, setUsernameInput] = React.useState('');
    const [emailInput, setEmailInput] = React.useState('');
    const [passwordInput, setPasswordInput] = React.useState('');
    const [confirmPasswordInput, setConfirmPasswordInput] = React.useState('');
    let [valid, setValid] = React.useState('');

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
        setValid(validate(usernameInput, emailInput, passwordInput, confirmPasswordInput));
        if (valid === true) {
            const response = await fetch(`/api/auth/create`, {
                method: 'post',
                body: JSON.stringify({ username: usernameInput, password: passwordInput, email: emailInput}),
                headers: {
                  'Content-type': 'application/json; charset=UTF-8',
                },
            });
            
            if (response?.status === 200) {
                //localStorage.setItem('userName', userName);
                alert("success!")
              } else {
                setValid('Username already in use');
              }
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

    return (
        <main className='register-body'>
            <div className="register">
                    <form>
                        <div id="registerTitle">register</div>
                        <input type="text" id="userName" placeholder="username" onChange={usernameChange}/>
                        <input type="email" id="email" placeholder="email" onChange={emailChange} />
                        <input type="password" id="userPassword" placeholder="password" onChange={passwordChange}/>
                        <input type="password" id="confirmPassword" placeholder="confirm password" onChange={confirmPasswordChange} />
                        <NavLink className= "button-navlink" id ="login" to="/login">login</NavLink>
                        <button id="register" onClick={() => createUser()} type="button">register</button>
                    </form>
                <div id="errMessage">{valid}</div>
            </div>
        </main>
    );
}