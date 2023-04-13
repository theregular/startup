import React, { useState } from 'react';
import { FaCircle, FaRegCircle } from "react-icons/fa";
import './starRating.css'

export function StarRating(props) {
  const username = props.username;
  const tellParent = props.updated;
  const [rating, setRating] = useState();
  const [hoverCount, sethoverCount] = useState();

  React.useEffect(() => {
      async function addRating() {
        if(rating) {
        tellParent(true);//tell parent that child updated
        console.log(`RATING: ${rating}`);
        const response = await fetch(`/api/auth/addrating`, {
          method: 'post',
          body: JSON.stringify({ username: username, rating: rating }),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        });
        
        if (response.status === 200) {
          console.log(`added rating of ${rating} to DB successfully`);
          //setRating(rating);
        } else {
          alert("Failed to add rating");
        }
        
        tellParent(false);
      }
    }
    addRating();
  }, [rating, username, tellParent]);


  const handleRatingClick = (index) => {
    setRating(index + 1);
    sethoverCount(index + 1);
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

  return (
    <div id= "rater">
      {renderStars()}
      {rating && <div>You rated {props.username}: {rating}</div>}
    </div>
  );
}