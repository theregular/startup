import React from 'react';
import { Navigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import './profile.css'

export function Profile() {
    const { username } = useParams(); //gets username from params
    const [userData, setUserData] = React.useState(null);
    const [updated, setUpdated] = React.useState(true);
    const [redirect, setRedirect] = React.useState(false);

    const auth = true;
    //find way to update this
    React.useEffect(() => {
        if(!auth){
        setRedirect(true);
        }
        async function fetchData() {
            if(updated) {
                //console.log("parent updated");
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
                setUpdated(false);
            }
        }
        fetchData();
    }, [updated]);
  
    if (redirect) {
      return <Navigate to='/login' replace={true}/>;
    }

    if (!userData) {
        return <p>Loading user data . . . </p>;
    }
    else if (userData === "Does Not Exist") {
        return <p>User doesn't exist</p>;
    }
    else {
        return (
            <main className='profile'>            
                <div id = "profile-container">
                    <div className ="pfp-top">
                        <div id = 'settings'>
                            <button id="settings-btn" onClick=""></button>
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