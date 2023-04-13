import './App.css';
import React from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Register } from './register/register';
import { Profile } from './profile/profile';
import { AuthState } from './login/authState';
import { Home } from './home/home';
import { Find } from './find/find';


function App() {
  const [userName, setUserName] = React.useState(localStorage.getItem('userName') || 'test'); //update to be dynamic username detection
  // Asynchronously determine if the user is authenticated by calling the service
  const [authState, setAuthState] = React.useState(AuthState.Unknown);

  /*
  React.useEffect(() => {
    if (userName) {
      fetch(`/api/user/${userName}`)
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          }
        })
        .then((user) => {
          const state = user?.authenticated ? AuthState.Authenticated : AuthState.Unauthenticated;
          setAuthState(state);
        });
    } else {
      setAuthState(AuthState.Unauthenticated);
    }
  }, [userName]);
*/
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
        <Route path='/find' element={<Find />} />
        <Route path='/login' element={<Login 
              userName={userName}
              authState={authState}
              onAuthChange={(userName, authState) => {
                setAuthState(authState);
                setUserName(userName);
              }}/>} />
        <Route path='/register' element={<Register />} />
        <Route path='/profile/:username' element={<Profile />} />
        <Route path='*' element={<NotFound />} />
      </Routes>

    </div>
  );
}

function NotFound() {
  return <main className='error' >404: Page Not Found</main>;
}


export default App;
