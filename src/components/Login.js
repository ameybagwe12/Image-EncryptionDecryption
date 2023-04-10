import React from "react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  // useState for getting data and updating database

  const navigate = useNavigate();

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  // Getting the input tag's name and value
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setUser({
      ...user,
      [name]: value,
    });
  };

  const login = () => {
    // similar to register
    axios.post("http://localhost:5000/login", user).then((res) => {
      console.log("====================================");
      console.log(res.data);
      console.log("====================================");
    });
    navigate("/");
  };

  return (
    <>
      <h3>Sign In</h3>
      <div className="mb-3">
        <label>Email address</label>
        <input
          type="email"
          className="form-control"
          onChange={handleChange}
          placeholder="Enter email"
          name="email"
        />
      </div>
      <div className="mb-3">
        <label>Password</label>
        <input
          type="password"
          name="password"
          onChange={handleChange}
          className="form-control"
          placeholder="Enter password"
        />
      </div>
      <div className="d-grid">
        <button onClick={login} type="submit" className="btn btn-primary">
          Submit
        </button>
      </div>
    </>
  );
}
