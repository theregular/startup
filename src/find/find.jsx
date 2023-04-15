import React from 'react';
import './find.css';
import { StarRating } from './starRating.jsx';
// /import { AuthState } from './authState';

export function Find({authState, userName}) {
    const [findInput, setFindInput] = React.useState('');
    const [userData, setUserData] = React.useState(null);
    const [updated, setUpdated] = React.useState(false);
    const [msg, setMsg] = React.useState('');


    const findChange = (e) => {
        setFindInput(e.target.value.trim());
    };

    function childUpdated () {
        console.log("parent saw child update");
        setUpdated(true);
    }

    React.useEffect(() => { //rerender user on update of some kind
        async function fetchData() {
            if(updated) {
                //console.log("parent updated");
                const response = await fetch(`/api/user/${findInput}`, {
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
                    setUserData(null);
                    //setMsg("");
                }
                setUpdated(false);
            }
        }
        fetchData();
    }, [updated, findInput]);
    
    async function findUser() { //intial render of user on search
        const valid = validate(findInput);
        if (valid) {
            const response = await fetch(`/api/user/${findInput}`, {
                method: 'get',
                headers: {
                'Content-type': 'application/json; charset=UTF-8',
                },
            });
            if (response.status === 200) {
                const json = await response.json();
                setMsg("");
                setUserData(json);
            }
            else {
                setMsg("Cannot find user");
                setUserData(null);
            }
        }
        else {
            setMsg("Please enter a username");
        }
        setUpdated(false);
    }

    const handleKeyDown = async (event) => {
        if (event.keyCode === 13) { //if enter key pressed
           await findUser();
        }
    }
    

    function validate(input) {
        if (input === '') {
            return false;
        }
        return true;
    }


    return (
        <main className='find-body'>
            <div className='find'>
                <div id="findTitle">find a user</div>
                <form className="find-form">
                    <input id= "search" type="text" placeholder="enter username here" onKeyDown={handleKeyDown} onChange={findChange}/>
                    <button id ="findBtn" type="button" onClick={() => findUser()}>find</button>
                </form>
                <div id="result">{msg}</div>
            </div>

            { userData && (
                <div id = "profile-container">
                    <div className ="pfp-top">
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
                                <div className="rating">
                                    {/* <StarRating username={userData.username}/>*/} 
                                    <StarRating id="star-rater" authState={authState} updated={childUpdated} username={userData.username} userName={userName}/>
                                </div>
                                {userData.rating === 0 && ( <span id="out-of-five-find">No Ratings Yet!</span>)}
                                    {userData.rating !== 0 && (
                                        <div id="avg-rating-container">
                                        <span id ='avgRating-find'>{userData.rating}</span>
                                        <span id="out-of-five-find">/ 5</span>
                                    </div>
                                    )}
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
                                {/* 
                                <div id="thankYouMsg"></div>
                                <textarea id='reviewText' placeholder='type your review here' type = 'text' maxlength="100" style="display: none"></textarea>
                                <button id="reviewButton" onclick='leaveReview()'>Leave A Review</button>
                                <button id="submitBtn" style="display: none" onclick="submitReview()">Submit</button>
                                */}
                                <div className = "top-reviews">
                                    <div>{userData.review1}</div>
                                    <div>{userData.review2}</div>
                                    <div>{userData.review3}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) }
        </main>
    );
}