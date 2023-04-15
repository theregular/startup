import React from 'react';
import './home.css'
import { FaFacebook } from 'react-icons/fa';
import { FaTwitter } from 'react-icons/fa';
import { FaInstagram } from 'react-icons/fa';
import { FaGithub} from 'react-icons/fa';

export function Home() {
    const [displayLinks, setDisplayLinks] = React.useState(false);
    const [displayClout, setDisplayClout] = React.useState(false);
    const [displayUs, setDisplayUs] = React.useState(false);
    const [displayTop, setDisplayTop] = React.useState(false);

    const mouseEnterLinks = () => {
        setDisplayLinks(true);
    };
    const mouseLeaveLinks = () => {
        setDisplayLinks(false);
    };
    const mouseEnterClout = () => {
        setDisplayClout(true);
    };
    const mouseLeaveClout = () => {
        setDisplayClout(false);
    };
    const mouseEnterUs = () => {
        setDisplayUs(true);
    };
    const mouseLeaveUs = () => {
        setDisplayUs(false);
    };
    const mouseEnterTop = () => {
        setDisplayTop(true);
    };
    const mouseLeaveTop = () => {
        setDisplayTop(false);
    };

    return (
        <main className='home-body'>

            <div className="widget" onMouseEnter={mouseEnterUs} onMouseLeave={mouseLeaveUs}>
                <div className="about-us">
                    <h1>About Us</h1>
                    { displayUs && (
                    <div className="inner">
                        <p> Ben and David are two computer science students who are passionate about web programming and
                            software development.
                            They are both currently enrolled in a top university, pursuing their degrees in Computer
                            Science.
                            Throughout their
                            studies, they have developed a keen interest in web development and have undertaken various
                            projects
                            and assignments
                            to hone their skills. We hope that you enjoy our using our simple website/app.
                        </p>
                    </div>
                    )}
                </div>
            </div>

            <div className="inverted-widget" onMouseEnter={mouseEnterClout} onMouseLeave={mouseLeaveClout}>
                <div className="outer">
                    <h1>About CLOUT</h1>
                    { displayClout && (
                    <div className="inner">
                        <p> The first social media where your fame doesn't come from your follower count, but from how
                            you're
                            rated by your peers.
                            Theoretically, the better the person you are, the higher ranking you will be! Clout allows for
                            an
                            overall
                            rating (out of 5), a view of where you rank among those in your local community, country, and
                            even
                            the world,
                            as well as the ability to leave reviews on people and the kind of person they are. CLOUT, where
                            do
                            you stand?
                        </p>
                    </div>
                    )}
                </div>
            </div>

            <div className="inverted-widget" onMouseEnter={mouseEnterTop} onMouseLeave={mouseLeaveTop}>
                <div className="outer">
                    <h1>World Ranks</h1>
                    { displayTop && (
                    <div className="inner">
                        <p>Best people go here</p>
                    </div>
                    )}
                </div>
            </div>

            <div className="widget" onMouseEnter={mouseEnterLinks} onMouseLeave={mouseLeaveLinks}>
                <div className="outer">
                    <h1>Follow us on our Social Media!</h1>

                    { displayLinks && (
                    <div id="links">
                            <a href="https://www.facebook.com/" aria-label="Facebook" target="_blank" rel="noopener noreferrer"><FaFacebook className="fa fa-facebook"/></a>
                            <a href="https://twitter.com" aria-label="Twitter" target="_blank" rel="noopener noreferrer"><FaTwitter className="fa fa-twitter"/></a>
                            <a href="https://www.instagram.com" aria-label="Instagram" target="_blank" rel="noopener noreferrer"><FaInstagram className="fa fa-instagram"/></a>
                            <a href="https://github.com/theregular/startup" aria-label="Github" target="_blank" rel="noopener noreferrer"><FaGithub className="fa fa-github"/></a>
                    </div>
                    )}
                </div>
            </div>
        </main>
    );
}