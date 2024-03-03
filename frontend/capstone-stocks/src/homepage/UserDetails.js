import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StocksApi from '../api/Api';

function UserDetails({ currentUser, logout }) {
  const [searchResults, setSearchResults] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
     
      const response = await StocksApi.request('search', { q: searchQuery });
      console.log("Full response:", response); // This should log the stock data
      setSearchResults(response); 
    } catch (error) {
      console.error("Error searching:", error);
    }
  };
  

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div>
      {currentUser && (
        <div>
          <h2>User Details</h2>
          <p>Username: {currentUser.username}</p>
          <p>Email: {currentUser.email}</p>
          <p>First Name: {currentUser.firstname}</p>
          <p>Last Name: {currentUser.lastname}</p>
          <button onClick={handleLogout}>Logout</button>
          <div>
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <button onClick={handleSearch}>Search</button>
          </div>
          {searchResults && (
            <div>
              <h3>Search Results</h3>
              <p>Closing Price: {searchResults.c}</p>
              <p>Change: {searchResults.d}</p>
              <p>Change Percentage: {searchResults.dp}%</p>
              <p>High: {searchResults.h}</p>
              <p>Low: {searchResults.l}</p>
              <p>Open: {searchResults.o}</p>
              <p>Previous Close: {searchResults.pc}</p>
              <p>Time: {new Date(searchResults.t * 1000).toLocaleString()}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default UserDetails;



