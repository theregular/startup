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
        <h6 class="links">
            <NavLink to ='find' style={{ textDecoration: 'none' }} >Find /</NavLink>
            <NavLink to ='login' style={{ textDecoration: 'none' }} > Login /</NavLink>
            <NavLink to ='register' style={{ textDecoration: 'none' }} > Register /</NavLink>
            <NavLink to ={`profile/${userName}`} style={{ textDecoration: 'none' }} > Profile</NavLink>
        </h6>
      </header>
      
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/find' element={
            <Find 
              authState={authState}

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
        <Route path='/register' element={<Register />} />
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
