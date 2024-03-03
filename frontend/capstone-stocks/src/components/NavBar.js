//Had more plans to add to this but didn't make it

import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import UserContext from '../auth/UserContext';

const Navbar = () => {
    const { currentUser, logout } = useContext(UserContext); 

    const buttonStyle = {
        color: 'white',
        backgroundColor: 'blue',
        border: 'none',
        cursor: 'pointer',
        textDecoration: 'underline',
        margin: '0 10px',
    };

    const navbarStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'blue',
        color: 'white',
        padding: '10px',
    };

    const linkStyle = {
        color: 'white',
        textDecoration: 'none',
        margin: '0 10px',
    };

    return (
        <div style={navbarStyle}>
            <Link to="/" style={linkStyle}>Stock Helper</Link>
            <div>
                <Link to="/" style={linkStyle}>Home</Link>
                {currentUser && <Link to="/user_details" style={linkStyle}>User Details</Link>}
                {currentUser && <button onClick={() => logout()} style={buttonStyle}>Logout</button>}
            </div>
        </div>
    );
};

export default Navbar;
