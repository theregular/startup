import React from "react";
import "./find.css";
import { StarRating } from "./starRating.jsx";

export function Find({authState, userName}) {
    //find
    const [findInput, setFindInput] = React.useState('');
    const [userData, setUserData] = React.useState(null);
    const [updated, setUpdated] = React.useState(true);

    //review
    const [showReviewBox, setShowReviewBox] = React.useState(false);
    const [reviewText, setReviewText] = React.useState("");
    //const [reviews, setReviews] = React.useState([]);

    //message
    const [msg, setMsg] = React.useState("");

    const findChange = (e) => {
        setFindInput(e.target.value.trim());
    };

    /* PAGE UPDATE */

    function childUpdated() {
        console.log("parent saw child update");
        setUpdated(true);
    }

    React.useEffect(() => {
        //rerender user on update of some kind
        async function fetchData() {
            if (updated) {
                //console.log("parent updated");
                const response = await fetch(`/api/user/${findInput}`, {
                    method: 'get',
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                    },
                });
                if (response.status === 200) {
                    const json = await response.json();
                    setUserData(json);
                } else {
                    setUserData(null);
                    //setMsg("");
                }
                setUpdated(false);
            }
        }
        fetchData();
    }, [updated, findInput]);

    /*FIND SEARCH */

    async function findUser() {
        //intial render of user on search
        const valid = validateFind(findInput);
        if (valid) {
            const response = await fetch(`/api/user/${findInput}`, {
                method: 'get',
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
            });
            if (response.status === 200) {
                const json = await response.json();
                setMsg("");
                setUserData(json);
            } else {
                setMsg("Cannot find user");
                setUserData(null);
            }
        } else {
            setMsg("Please enter a username");
            setUserData(null);
        }
        setUpdated(false);
    }

    // not working for some reason, fix later
    const handleKeyDown = (event) => {
        if (event.keyCode === 13) { //if enter key pressed
           findUser();
        }
    };
    

    function validateFind(input) {
        if (input === "") {
            return false;
        }
        return true;
    }

    /*REVIEW*/

    const reviewTextChange = (e) => {
        setReviewText(e.target.value);
    };

    function handleLeaveReview() {
        if(userName === userData.username){
            alert("You can't review yourself");
        }
        else {
            setShowReviewBox(true);
        }
    }

    function handleCancel() {
        setShowReviewBox(false);
    }


    async function submitReview() {
        const valid = validateReview(reviewText);
        if(valid) {
            console.log("leave review");
            const response = await fetch(`/api/auth/addreview`, {
                method: 'post',
                body: JSON.stringify({ username: userData.username, review: reviewText }),
                headers: {
                  'Content-type': 'application/json; charset=UTF-8',
                },
            });
            if (response.status === 200) {
                console.log("review added to DB");
                setShowReviewBox(false);
                setReviewText('');
                childUpdated();
            }
            else {
                console.log("error adding review to DB");
            }

        }
        else {
            alert("please enter a review");
        }

        /*

        const newReviewKey = `review${Object.keys(userData).length + 1}`;
        setUserData((prevData) => ({
            ...prevData,
            [newReviewKey]: reviewText,
        }));
        setReviewText("");
        setShowReviewBox(false);

        fetch("/api/auth/addreview")
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((data) => {
            setReviews(data.reviews);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
        */
        
    }

    function validateReview(input) {
        if (input === "") {
            return false;
        }
        return true;
    }

    /* HTML */

    return (
        <main className="find-body">
            <div className="find">
                <div id="findTitle">find a user</div>
                <form className="find-form">
                    <input
                        id="search"
                        type="text"
                        value={findInput}
                        placeholder="enter username here"
                        onKeyDown={handleKeyDown}
                        onChange={findChange}
                    />
                    <button id="findBtn" type="button" onClick={() => findUser()}>
                        find
                    </button>
                </form>
                <div id="result">{msg}</div>
            </div>

            {userData && (
                <div id="profile-container">
                    <div className="pfp-top">
                        <img className="pfp-pic" src="/images/cool carl.jpg" alt="pfp" />
                        <div className="pfp-userinfo">
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
                                <div id="hash">#</div>
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
                                <p>{/* This is just used to create a white line*/}</p>
                                {showReviewBox ? (
                                    <div>
                                        <textarea
                                            id="reviewBox"
                                            placeholder="type review here"
                                            value={reviewText}
                                            onChange={reviewTextChange}
                                            maxLength="100"
                                        />
                                        <div id="review-buttons">
                                            <button id="reviewBtn" onClick={handleCancel}>cancel</button>
                                            <button id="reviewBtn" onClick={submitReview}>submit</button>
                                        </div>
                                    </div>
                                ) : (
                                    <button id="reviewBtn" onClick={handleLeaveReview}>
                                        Leave Review
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
