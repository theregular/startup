import React from 'react';
import { NavLink} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { AuthState } from './authState';
import './login.css';

export function Login({prefill, authState, onAuthChange}) {
    const navigate = useNavigate();
    const [usernameInput, setUsernameInput] = React.useState(prefill);
    const [passwordInput, setPasswordInput] = React.useState('');
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

            //const response = await 
            fetch(`/api/auth/login`, {
                method: 'post',
                body: JSON.stringify({ username: usernameInput, password: passwordInput }),
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
                    setMsg('Incorrect username or password!');
                }
              });
        }
    }

    const handleKeyDown = (event) => {
        if (event.keyCode === 13) { //if enter key pressed
            loginUser();
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
        navigate(`/profile/${usernameInput}`);///return <Navigate to={`/profile/${usernameInput}`} replace={true}/>;
    }
    /*
    if (authState === AuthState.Authenticated) {
        return (navigate('/login'));
    }
    else {
        */
        return (
            <main className='login-body'>
                <div className="login">
                    <form className="login-form">
                        <div id="loginTitle">login</div>
                        <input type="text" value={usernameInput} id="userName" placeholder="username" onKeyDown={handleKeyDown} onChange={usernameChange}/>
                        <input type="password" id="userPassword" placeholder="password" onKeyDown={handleKeyDown} onChange={passwordChange} />
                        <div id="buttons">
                            <button id ="loginBtn" type="button" onClick={() => loginUser()}>login</button>
                            <NavLink className= "button-navlink" id ="register" to="/register">register</NavLink>
                        </div>
                    </form>
                    <div id="errMessage">{msg}</div>
                </div>
            </main>
        );
    //}
}