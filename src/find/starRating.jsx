import React, { useState } from 'react';
import { FaCircle, FaRegCircle } from "react-icons/fa";
import './starRating.css'
import { AuthState } from '../login/authState';

let ratingChanged = false; //change later to not use global variable

export function StarRating(props) {
  const loggedInUser = props.userName;
  const username = props.username;
  const tellParent = props.updated;
  const [rating, setRating] = useState();
  const [hoverCount, sethoverCount] = useState();


  React.useEffect(() => {
      
    if (ratingChanged) {
      //console.log("got in");
      addRating();
    }

  });
  

  async function addRating() {
    console.log("child updated");
    if(rating) { //rating != 0
      console.log(`RATING: ${rating}`);
      const response = await fetch(`/api/auth/addrating`, {
        method: 'post',
        body: JSON.stringify({ username: username, rating: rating, ratedBy: loggedInUser}),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      
      if (response.status === 200) {
        console.log(`added rating of ${rating} to DB successfully`);
        //setRating(rating);
        const newAvg = await getAverageRating(username);
        //console.log(`NEW AVG: ${newAvg}`);
        await updateAvgRating(username, newAvg); //update DB with new average rating
        tellParent();
        ratingChanged = false;
      } else {
        alert("Failed to add rating");
      }
    }
  }

  async function getAverageRating(username) {
  
    const response = await fetch(`/api/auth/getavgrating/${username}`, {
      method: 'get',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
  
    const body = await response.json();
  
    if (response.status === 200) {
      return body.avgRating;
    }
  
    return 'ERROR';
  }

  async function updateAvgRating(username, rating) {
    const response = await fetch(`/api/auth/updateavg`, {
      method: 'post',
      body: JSON.stringify({ username: username, avgRating: rating }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
  
    if (response.status === 200) {
      //alert("new avg rating stored!");
      //console.log("new avg rating stored!");
    } else {
      alert('could not store rating');
    }
  }
  


  const handleRatingClick = (index) => {
    //console.log(props.authState);
    if (props.authState === AuthState.Authenticated) {
      if(loggedInUser === username) {
        alert("you can't rate yourself!");
      }
      else {
        ratingChanged = true;
        setRating(index + 1);
        sethoverCount(index + 1);
      }
    }
    else {
      alert("please login or make an account to rate people!");
    }
    //addUserRating();
  };
  const handleMouseEnter = (index) => {
    if (index + 1 <= rating) {
        sethoverCount(rating);
    }
    else {
        sethoverCount(index + 1);
    }
  };

  const handleMouseLeave = (index) => {
    sethoverCount(0);
  };

  const renderStars = () => {
    let stars = [];
    if (hoverCount) {
        for (let i = 0; i < 5; i++) {
            if (i < hoverCount) {
                stars.push(<FaCircle id="hoverCircle" key={i} onClick={() => handleRatingClick(i)} onMouseEnter={() => handleMouseEnter(i)}
                onMouseLeave={() => handleMouseLeave(i)}/>);
            }
            else {
                stars.push(<FaRegCircle id="circle" key={i} onClick={() => handleRatingClick(i)} onMouseEnter={() => handleMouseEnter(i)}
                onMouseLeave={() => handleMouseLeave(i)} />);
            }
        }
    }
    else {
        for (let i = 0; i < 5; i++) {
            if (i < rating) {
                stars.push(<FaCircle id="circle" key={i} onClick={() => handleRatingClick(i)} onMouseEnter={() => handleMouseEnter(i)}
                onMouseLeave={() => handleMouseLeave(i)}/>);
            }
            else {
                stars.push(<FaRegCircle id="circle" key={i} onClick={() => handleRatingClick(i)} onMouseEnter={() => handleMouseEnter(i)}
                onMouseLeave={() => handleMouseLeave(i)} />);
            }
        }
    }

    return stars;
  };

  //{rating && <div>You rated {props.username}: {rating}</div>}

  return (
    <div id= "rater">
      {renderStars()}
    </div>
  );
}