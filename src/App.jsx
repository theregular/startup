import './App.css';
import React from 'react';
import { NavLink, Route, Routes, Navigate } from 'react-router-dom';
import { Login } from './login/login';
import { Register } from './register/register';
import { Profile } from './profile/profile';
import {AuthState} from './login/authState';
import { Home } from './home/home';
import { Find } from './find/find';


function App() {
  const [userName, setUserName] = React.useState(localStorage.getItem('username') || ''); //gets username that was stored
  // Asynchronously determine if the user is authenticated by calling the service
  const [authState, setAuthState] = React.useState(AuthState.Unknown);

  //dark mode stuff
  const [darkMode, setDarkMode] = React.useState(false);
  const backColor = !darkMode ? '#1b1b1b' : '#ffffff00'; //left is dark right is light
  const textColor = !darkMode ? '#ffffff' : '#000000';
  const formInputColor = !darkMode ? '#1f2223' : '#f2f2f2';

  const darkModeChecked = (event) => {
    setDarkMode(event.target.checked);
    updateWildcardCSS();
  }

  function updateWildcardCSS() {
    //document.head.querySelector('style')
    let style = document.getElementById("dark-mode-style");
    if(style) {
      document.head.removeChild(style);
    }
    style = document.createElement('style');
    style.id="dark-mode-style";
    style.innerHTML = `body { background-color: ${backColor}; color: ${textColor}} 
                        .login-form input {background: ${formInputColor}; color: ${textColor}}
                        .register-form input {background: ${formInputColor}; color: ${textColor}}
                        .find-form input {background: ${formInputColor}; color: ${textColor}}
                      `;
    document.head.appendChild(style);
  }

  React.useEffect(() => {
    if (userName) {
      fetch(`/api/user/${userName}`)
        .then((response) => {
          //console.log("name found");
          if (response.status === 200) {
            return response.json();
          }
        })
        .then((user) => {
          const state = user?.authenticated ? AuthState.Authenticated : AuthState.Unauthenticated;
          //console.log(state);
          setAuthState(state);
        });
    } else {
      //console.log("unauth");
      setAuthState(AuthState.Unauthenticated);
    }
  }, [userName]);


  return (
    <div className="body">
      <header>
      <NavLink className="clout" to =''>CLOUT</NavLink>
        <h6 className="slogan">where do you stand?</h6>
        <div id="switch">
            <label class="switch">
                <input type="checkbox" checked={darkMode} onChange={darkModeChecked}/>
                <span class="slider"></span>
            </label>
            {!darkMode && (<div id="switch-text">Light Mode</div>)}
            {darkMode && (<div id="switch-text">Dark Mode</div>)}
        </div>
        <h6 className="links">
            <NavLink className="navlink" to ='find' style={{ textDecoration: 'none'}} >Find /</NavLink>
            <NavLink className="navlink" to ='login' style={{ textDecoration: 'none' }} > Login /</NavLink>
            <NavLink className="navlink" to ='register' style={{ textDecoration: 'none' }} > Register /</NavLink>
            <NavLink className="navlink" to ={`profile/${userName}`} style={{ textDecoration: 'none' }} > Profile</NavLink>
        </h6>
      </header>
      
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/find' element={
            <Find 
              authState={authState}
              userName={userName}
            />}
         />
        <Route path='/login' element={
          <Login 
              prefill={userName} 
              authState={authState}
              onAuthChange={(userName, authState) => {console.log("LOGIN AUTH STATE CHANGE"); console.log(authState);
                setAuthState(authState);
                setUserName(userName);
              }}/>
            }
          />
        <Route path='/register' element={<Register 
                onAuthChange={(userName, authState) => {console.log("REGISTER AUTH STATE CHANGE"); console.log(authState);
                setAuthState(authState);
                setUserName(userName);
              }}/>} />
        <Route path='/profile/:username' element={
          <Profile 
            authState={authState}
            userName={userName}
            onAuthChange={(userName, authState) => {console.log("LOGOUT AUTH STATE CHANGE"); console.log(authState);
              setAuthState(authState);
              setUserName(userName);
            }}/>
          } 
        />
        <Route path='/profile' element={<Navigate to='/login' replace={true}/>} />
        <Route path='*' element={<NotFound />} />
      </Routes>

    </div>
  );
}

function NotFound() {
  return <main className='error' >404: Page Not Found</main>;
}


export default App;
