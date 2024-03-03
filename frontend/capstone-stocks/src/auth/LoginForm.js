import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

function LoginForm({ login, setToken }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState([]);

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  }

  async function handleSubmit(evt) {
    evt.preventDefault();
    let result = await login(formData);
    if (result && result.success) {
      // Redirect to the user details page on successful login
      navigate('/user_details');
    } else {
      setFormErrors(["Invalid username or password"]);
    }
  }
  return (
    <div className="LoginForm">
      <div className="container col-md-6 offset-md-3 col-lg-4 offset-lg-4">
        <h2 className="mb-3">Log In</h2>
        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Username</label>
                <input
                  name="username"
                  className="form-control"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              {formErrors.length > 0 && (
                <div className="alert alert-danger">
                  {formErrors.map((error, index) => (
                    <p key={index}>{error}</p>
                  ))}
                </div>
              )}
              <button
                type="submit"
                className="btn btn-primary float-right"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
