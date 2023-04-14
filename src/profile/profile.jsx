import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import {AuthState} from '../login/authState';
import './profile.css'

export function Profile({authState, onAuthChange, userName}) {
    const navigate = useNavigate();
    const { username } = useParams(); //gets username from params
    const [userData, setUserData] = React.useState(null);
    const [settings, setSettings] = React.useState(false);
    const [changeName, setChangeName] = React.useState(false);
    const [nameChangeInput, setNameChangeInput] = React.useState('');

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
        //console.log("LOGOUT");
        fetch(`/api/auth/logout`, {
          method: 'delete',
        }).then(() => onAuthChange(username, AuthState.Unauthenticated));
    }

    function settingsOption() {
        if(settings) {
            setSettings(false);
            setChangeName(false);
            console.log("made it here");
        }
        else {
            setSettings(true);
        }
    }

    function changeNameBox() {
        if(changeName) {
            setChangeName(false);
        }
        else {
            setChangeName(true);
        }
    }

    async function submitNameChange() {
        const valid = validate(nameChangeInput);
        console.log("submit");
        if (valid === true) {
            console.log("valid true");
            const response = await fetch(`/api/auth/changedisplayname`, {
                method: 'post',
                body: JSON.stringify({ username: username, newDisplayName: nameChangeInput}),
                headers: {
                  'Content-type': 'application/json; charset=UTF-8',
                },
            });
            if (response?.status === 200) {
                setChangeName(false);
            } else {
            alert("fail!");
            //console.log("fail!");
            }
    }
    }

    const nameChangeText = (e) => {
        setNameChangeInput(e.target.value.trim());
    };

    function validate(input) {
        if (input === '') {
            return false;
        }
        return true;
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
                            <div id = 'settings-buttons'>
                                <button id="settings-btn"onClick={()=> logout()}>Logout</button>
                                <button id="settings-btn" onClick={()=> settingsOption()}>Settings</button>
                            </div>
                            <div id = 'settings'>
                                    {settings && (
                                        <div id="settings-options">
                                            {changeName && (
                                                <div id="name-change">
                                                    <input type="text" id="change-name" maxLength="25" placeholder='enter new name here' onChange={nameChangeText}></input>
                                                    <button id="submit-btn" onClick={()=> submitNameChange()}>submit</button>
                                                    <button id="submit-btn" onClick={()=> setChangeName(false)}>cancel</button>
                                                </div>
                                            )}
                                            {!changeName && (<button id="change-btn" onClick={()=> changeNameBox()}>change name</button>)}
                                            <button id="change-btn">change pfp</button>
                                        </div>
                                    )}
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