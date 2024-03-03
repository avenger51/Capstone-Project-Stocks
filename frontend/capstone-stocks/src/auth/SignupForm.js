import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignupForm = ({ signup }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        firstname: '',
        lastname: '',
    });
    const [formErrors, setFormErrors] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await signup(formData); 
            if(result.success) {
                // Use replace to navigate to prevent going back to signup form...
                navigate('/user_details', { replace: true }); 
            } else {
              
                setFormErrors(result.errors || ["Signup failed. Please try again."]);
            }
        } catch (errors) {
            setFormErrors(errors.length ? errors : ["Signup failed. Please try again."]);
        }
    };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <label>First Name:</label>
          <input type="text" name="firstname" value={formData.firstname} onChange={handleChange} required />
        </div>
        <div>
          <label>Last Name:</label>
          <input type="text" name="lastname" value={formData.lastname} onChange={handleChange} required />
        </div>
        <button type="submit">Sign Up</button>
        {formErrors.length > 0 && (
          <div className="alert alert-danger">
            {formErrors.map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </div>
        )}
       
      </form>
    </div>
  );
};

export default SignupForm;
