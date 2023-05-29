import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import {AuthState} from '../login/authState';
import { FaBars} from 'react-icons/fa';
import './profile.css'
import './switch.css'

export function Profile({authState, onAuthChange, userName}) {
    const navigate = useNavigate();

    const [windowSize, setWindowSize] = React.useState({
        width: window.innerWidth,
        height: window.innerHeight
      });
    const [mobileView, setMobileView] = React.useState(windowSize.width <= 810 ? true : false);

    const { username } = useParams(); //gets username from params
    const [userData, setUserData] = React.useState(null);
    const [options, setOptions] = React.useState(false);
    const [settings, setSettings] = React.useState(false);
    const [changeName, setChangeName] = React.useState(false);
    const [nameChangeInput, setNameChangeInput] = React.useState('');
    const [changePfp, setChangePfp] = React.useState(false);
    const [image, setImage] = React.useState("/images/cool carl.jpg");
    const [OGimage, setOGImage] = React.useState(image);
    const [imageFile, setImageFile] = React.useState(null);
    //const [imageData, setImageData] = React.useState(null);

/*
    //dark mode stuff

    const [darkMode, setDarkMode] = React.useState(false);
    const backColor = !darkMode ? '#1b1b1b' : '#ffffff00';
    const textColor = !darkMode ? '#ffffff' : '#000000';
    function updateWildcardCSS() {
        //document.head.querySelector('style')
        const style = document.createElement('style');
        style.innerHTML = `* { background-color: ${backColor}; color: ${textColor}}`;
        document.head.appendChild(style);
    };

 const darkModeChecked = (event) => {
        setDarkMode(event.target.checked);
        updateWildcardCSS();
    }

    */

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


        // Add event listener to listen for window resize
        window.addEventListener('resize', handleResize);
    
        // Clean up the event listener on component unmount
        return () => {
          window.removeEventListener('resize', handleResize);
        };
    });

    const handleResize = () => {
        setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight
        });
        if (window.innerWidth <= 810 && !mobileView) {
            setMobileView(true);
            settingsWindowReset();
        }
        if (window.innerWidth > 810 && mobileView) {
            setMobileView(false);
            settingsWindowReset();
        }
    };

 
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

    function openSettingsOptions() {
        if(options) {
            setOptions(false);
            setSettings(false);
            setChangeName(false);
            setChangePfp(false);
        }
        else {
            setOptions(true);
        }
    }

    function settingsOption() {
        if(settings) {
            setSettings(false);
            setChangeName(false);
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

    function changePfpOption() {
        if(changePfp) {
            setChangePfp(false);
        }
        else {
            setChangePfp(true);
        }
    }

    function pfpChangeCancel(){
        setChangePfp(false);
        setImage(OGimage);
    }

    function settingsWindowReset() {
        setOptions(false);
        setSettings(false);
        setChangeName(false);
        setChangePfp(false);
        return true;
    }

    async function submitNameChange() {
        const valid = validate(nameChangeInput);
        console.log("submit");
        if (valid === true) {
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
    
/* -- send pfp as base64 --
    async function submitPfpChange() {
        console.log("SUBMIT");
        if (imageFile) {
            //convert image to base64 data
            const reader = new FileReader();
            reader.readAsDataURL(imageFile);
            reader.onload = async () => {
                const base64Image = reader.result.split(",")[1];
                //setImage("data:image/png;base64," + base64Image);
                const response = await fetch(`/api/auth/uploadpfp`, {
                    method: 'post',
                    body: JSON.stringify({ username: username}),//pfpData: base64Image}),
                    headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    },
                    });
                if (response.status === 200) {
                    console.log("SUCCESS");

                    //const json = await response.json();
                    //setUserData(json);
                }
                else {
                    console.log("FAIL");
                }
            }
        }
    }
    */
/* send pfp as FormData binary */
    async function submitPfpChange() {
        console.log("SUBMIT");
        if (imageFile) {
            //convert image to binary data
            const formData = new FormData();
            formData.append('username', username);
            formData.append('pfp', imageFile);
            
            const response = await fetch(`/api/auth/uploadpfp`, {
                method: 'post',
                body: formData
                });
            if (response.status === 200) {
                console.log("SUCCESS");

                //const json = await response.json();
                //setUserData(json);
            }
            else {
                console.log("FAIL");
            }
        }
    }
    
    /*
    async function submitPfpChange() {
        console.log("SUBMIT");
        if (imageFile) {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('pfpic', imageFile);

            const response = await fetch(`/api/auth/uploadpfp`, {
                method: 'post',
                body: formData,
                });
            if (response.status === 200) {
                console.log("SUCCESS");

                //const json = await response.json();
                //setUserData(json);
            }
            else {
                console.log("FAIL");
            }
        }
        else {
            console.log("NO FILE DETECTED");
        }
    }
    */
    
    const handleFileInputChange = (event) => {
        const img = event.target.files[0];
        const maxFileSize = 10 * 1024 * 1024; // 10 MB

        if (img && img.size <= maxFileSize) {
            setImageFile(img);
            //const fileUrl = URL.createObjectURL(img);
            //setImage(fileUrl);
        } else {
            alert("File size must be less than 10 MB");
        }
    };

    const nameChangeText = (e) => {
        setNameChangeInput(e.target.value.trim());
    };

    function validate(input) {
        if (input === '') {
            return false;
        }
        return true;
    }
    
    if (!userData) {
        return <p>Loading user data . . . </p>;
    }
    else if (userData === "Does Not Exist") {
        return <p>User doesn't exist</p>;
    }
    else {
        if ((authState === AuthState.Authenticated) && (userName === username)) {
            return (
                <main className='profile'>  {/*style={{ backgroundColor: backColor }}>*/}    
                    <div id = "profile-container">
                        <div className ="pfp-top">

                            {(windowSize.width <= 810) &&
                                (<button id="options-button" onClick={()=> openSettingsOptions()}><FaBars className="fa-bars"/></button>) 
                            }

                            {(windowSize.width > 810 || options) &&
                                (<div id = 'settings-buttons'>
                                    <button id="settings-btn"onClick={()=> logout()}>Logout</button>
                                    <button id="settings-btn" onClick={()=> settingsOption()}>Settings</button>
                                </div>)
                            }

                            <div id='settings'>
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
                                            {changePfp && (
                                                <div id="pfp-change">
                                                    <input id="file-input" type="file" accept="image/*" onChange={handleFileInputChange}/>
                                
                                                    <button id="submit-btn" onClick={()=> submitPfpChange()}>submit</button>
                                                    <button id="submit-btn" onClick={()=> pfpChangeCancel()}>cancel</button>
                                                </div>
                                            )}
                                            {!changePfp &&  (<button id="change-btn" onClick={()=> changePfpOption()}>change pfp</button>)}
                                            {/*
                                            <div id="switch">
                                                {!darkMode && (<div id="switch-text">Light Mode</div>)}
                                                {darkMode && (<div id="switch-text">Dark Mode</div>)}
                                                <label class="switch">
                                                    <input type="checkbox" checked={darkMode} onChange={darkModeChecked}/>
                                                    <span class="slider"></span>
                                                </label>
                                            </div>*/}
                                        </div>
                                    )}
                            </div>
                            <img className="pfp-pic" src={userData.pfp ? `data:image/jpeg;base64,${userData.pfp.toString('base64')}` : "/images/cool carl.jpg"} alt="pfp"/>
                            <div className ="pfp-userinfo">
                                <h2 className="name">{userData.displayName}</h2>
                                <p className="username">@{userData.username}</p>
                            </div>
                        </div>


                        <div className="pfp-body">
                            <div className="widget">

                                <div className="rating-body">
                                    <h1>RATING</h1>
                                    {userData.rating === 0 && ( <span id="out-of-five">No Ratings Yet!</span>)}
                                    {userData.rating !== 0 && (
                                        <div id="avg-rating-container">
                                        <span id ='avgRating'>{userData.rating}</span>
                                        <span id="out-of-five">/ 5</span>
                                    </div>
                                    )}
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
                                        <div id="review">{userData.review1}</div>
                                        <div id="review">{userData.review2}</div>
                                        <div id="review">{userData.review3}</div>
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