import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import {AuthState} from '../login/authState';
import './profile.css'

export function Profile({authState, onAuthChange, userName}) {
    const navigate = useNavigate();
    const { username } = useParams(); //gets username from params
    const [userData, setUserData] = React.useState(null);
    //const [redirect, setRedirect] = React.useState(false);

    //const auth = true;
    React.useEffect(() => {
        async function fetchData() {   
            const response = await fetch(`/api/user/${username}`, {
                method: 'get',
                headers: {
                'Content-type': 'application/json; charset=UTF-8',
                },
                });
            if (response.status === 200) {
                const json = await response.json();
                setUserData(json);
            }
            else {
                setUserData("Does Not Exist");
            }
        }
        fetchData();
    });
 
    /*
    if (redirect) {
      return <Navigate to='/login' replace={true}/>;
    }
    */
    
    async function logout() {
        console.log("LOGOUT");
        fetch(`/api/auth/logout`, {
          method: 'delete',
        }).then(() => onAuthChange(username, AuthState.Unauthenticated));
    }

    function openSettings() {
        console.log("SETTINGS");
    }

    //console.log("PROFILE SEES: ")
    //console.log(authState);
    if (!userData) {
        return <p>Loading user data . . . </p>;
    }
    else if (userData === "Does Not Exist") {
        return <p>User doesn't exist</p>;
    }
    else {
        if ((authState === AuthState.Authenticated) && (userName === username)) {
            return (
                <main className='profile'>    
                    <div id = "profile-container">
                        <div className ="pfp-top">
                            <div id = 'settings'>
                                <button id="settings-btn" onClick={()=> openSettings()}>Settings</button>
                                <button id="logout-btn"onClick={()=> logout()}>Logout</button>
                            </div>
                            <img className="pfp-pic" src="/images/cool carl.jpg" alt="pfp"/>
                            <div className ="pfp-userinfo">
                                <h2 className="name">{userData.displayName}</h2>
                                <p className="username">@{userData.username}</p>
                            </div>
                        </div>
                        <div className="pfp-body">
                            <div className="widget">
                                <div className="rating-body">
                                    <h1>RATING</h1>
                                    <span>Average Rating: </span>
                                    <span id = 'avgRating'>{userData.rating}</span>
                                    <div className="rating">
                                    </div>
                                    <div className = "rating-text"></div>
                                </div>
                            </div>
                            <div className="inverted-widget">
                                <div className="rank-body">
                                    <h1>RANK</h1>
                                    <div id='hash'>#</div>
                                    <h2 id="rank">{userData.rank}</h2>
                                    <p>in the world</p>
                                </div>
                            </div>
                            <div className="widget">
                                <div className="reviews-body" id="reviews-body">
                                    <h1>REVIEWS</h1>
                                    <div className = "top-reviews">
                                        <div>{userData.review1}</div>
                                        <div>{userData.review2}</div>
                                        <div>{userData.review3}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            );
        }
        else if ((authState === AuthState.Unauthenticated)) {
            return (navigate('/login'))
        }
        else if (authState === AuthState.Unknown) {
            //return (<p>UNKNOWN</p>);
            return <p>Loading user data . . . </p>;
        }
        else {
            if (userName !== username) { //change this to make more sense later for how it checks Authstate
                return (<p>this user not logged in</p>); //could change to display the editable profile you find in find.jsx
            }

            return (window.location.reload());
        }
    }
}