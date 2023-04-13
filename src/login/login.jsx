import React from 'react';
import { NavLink} from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import './login.css';

export function Login() {

    const [usernameInput, setUsernameInput] = React.useState('');
    const [passwordInput, setPasswordInput] = React.useState('');
    //let [valid, setValid] = React.useState('');
    const [redirect, setRedirect] = React.useState(false);
    const [msg, setMsg] = React.useState('');

    const usernameChange = (e) => {
        setUsernameInput(e.target.value.trim());
    };
    
    const passwordChange = (e) => {
        setPasswordInput(e.target.value.trim());
    };

    async function loginUser(){
        //setValid(validate(usernameInput, passwordInput)); //is valid input or not?
        
        const valid = validate(usernameInput, passwordInput);
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
                //alert("Login success!");
                setRedirect(true);
            } 
            else {
                setMsg('Incorrect username or password!');
            }
        }
    }

    function validate(username, password) {
        if (username === '') {
            //return 'Please enter a username';
            setMsg('Please enter a username');
            return false;
        }
        if (password === '') {
            //return 'Please enter a password';
            setMsg('Please enter a password');
            return false;
        }
        return true;
    }

    if (redirect) { //auto redirects to profile page when login successful
        return <Navigate to={`/profile/${usernameInput}`} replace={true}/>;
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
                <div id="errMessage">{msg}</div>
            </div>
        </main>
    );
}