import React from 'react';
import './profile.css'
import { StarRating } from './starRating.jsx';

export function Profile() {
    const [userData, setUserData] = React.useState([]);
    const [updated, setUpdated] = React.useState(false);


    const childUpdated = (prop) => {
        setUpdated(prop);
    }

    React.useEffect(() => {
        async function fetchData() {
            const response = await fetch('/api/user/bartchie', {
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

    }, []);

    if (!userData) {
        return <p>Loading user data . . . </p>;
    }
    else if (userData === "Does Not Exist") {
        return <p>User doesn't exist</p>;
    }
    else {
        return (
            <main className='profile'>
                {/* 
                <div>
                    <div>Profile Test</div>
                    <p>Username: {userData.username}</p>
                    <p>Display Name: {userData.displayName}</p>
                    <p>Average Rating: {userData.rating}</p>
                    <p>Review 1: {userData.review1}</p>
                    <p>Review 2: {userData.review2}</p>
                    <p>Review 3: {userData.review3}</p>
                </div>
                */}
                <div id = "profile-container">
                    <div className ="pfp-top">
                        <div id = 'settings'>
                            <button id="settings-btn" onclick="showMenu()"></button>
                            <label for="settings-btn"></label>
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
                                    <StarRating username={userData.username}/>
                                    {/*<StarRating update={childUpdated} username={userData.username}/> */} 
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
            </main>
        );
    }
}