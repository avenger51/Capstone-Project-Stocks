import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import UserContext from "../auth/UserContext";
import LogoutButton from '../components/LogoutButton'; 
import StocksApi from '../api/Api';

function Homepage({ currentUser: propCurrentUser }) {
  const { currentUser: contextCurrentUser, setCurrentUser } = useContext(UserContext);
  const currentUser = propCurrentUser || contextCurrentUser;
  const [newsStories, setNewsStories] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('http://localhost:5000/news'); 
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const news = await response.json();
        setNewsStories(news.slice(0, 3)); 
      } catch (error) {
        console.error("Failed to fetch news:", error);
      }
    };

    fetchNews();
  }, []); 

  useEffect(() => {
    const handlePopState = async () => {
     
      try {
       
        const currentUser = await StocksApi.getCurrentUser();
        if (currentUser) {
          setCurrentUser(currentUser);
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error("Error re-fetching user session:", error);
        setCurrentUser(null);
      }
    };
  
    window.addEventListener('popstate', handlePopState);
  
    return () => window.removeEventListener('popstate', handlePopState);
  }, [setCurrentUser]);

  return (
    <div className="Homepage">
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          {currentUser && (
            <>
              <li>
                <Link to="/user_details">User Details</Link>
              </li>
              <li>
                <LogoutButton />
              </li>
            </>
          )}
        </ul>
      </nav>
      {currentUser ? (
        <>
          <h2>Welcome, {currentUser.username}!</h2>
          <p>
            Please <Link to="/user_details">view your details</Link> or <LogoutButton />.
          </p>
        </>
      ) : (
        <>
          <h2>Welcome, Guest!</h2>
          <p>
            Please <Link to="/login">login</Link> or <Link to="/signup">sign up</Link>.
          </p>
        </>
      )}
      <div className="news-section">
        <h3>Latest News</h3>
        {newsStories.length > 0 ? (
          newsStories.map((story, index) => (
            <div key={index} className="news-story">
              <h4>{story.headline}</h4>
              <img src={story.image} alt="Story thumbnail" style={{ width: '100px', height: 'auto' }}/>
              <p>{story.summary}</p>
              <a href={story.url} target="_blank" rel="noopener noreferrer">Read more</a>
            </div>
          ))
        ) : (
          <p>No news stories available.</p>
        )}
      </div>
    </div>
  );
}

export default Homepage;



