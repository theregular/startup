import './App.css';
import React from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Register } from './register/register';
import { Profile } from './profile/profile';
import { Home } from './home/home';


function App() {
  return (
    <div className="body">
      <header>
      <NavLink className="clout" to =''>CLOUT</NavLink>
        <h6 className="slogan">where do you stand?</h6>
        <h6 class="links">
            <NavLink to ='login' style={{ textDecoration: 'none' }} >Login /</NavLink>
            <NavLink to ='register' style={{ textDecoration: 'none' }} > Register /</NavLink>
            <NavLink to ='profile' style={{ textDecoration: 'none' }} > Profile</NavLink>
        </h6>
      </header>
      
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='*' element={<NotFound />} />
      </Routes>

    </div>
  );
}

function NotFound() {
  return <main className='error' >404: Page Not Found</main>;
}


export default App;
