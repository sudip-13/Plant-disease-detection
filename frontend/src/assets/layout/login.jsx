import React, { useState, useEffect, useCallback } from 'react';
import '../styles/login.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import cookie from "js-cookie";

const FarmerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [attemptedAutoLogin, setAttemptedAutoLogin] = useState(false);
  const navigate = useNavigate();
  const autoLogin = async () => {
    const token = cookie.get("cookie-1");
    if (!token || attemptedAutoLogin) return;

    try {
      const result = await axios.post("http://localhost:4040/verifyjwt", { token: token });
      if (!result.status === 200) {
        toast.error("Auto login failed...", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        throw new Error("Auto login failed");
      } else {
        toast.success("Auto login success...", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setTimeout(() => {
          navigate('/home');
        }, 1500);
      }
      setAttemptedAutoLogin(true);
    } catch (error) {
      console.error("Server error autologin failed", error);
    }
  };

  const handleLogin = async () => {

    if (email === '' || password === '') {
      alert('Please enter both email and password.');
    } else {
      try {
        const result = await axios.post("http://localhost:4040/login", { email, password });
        console.log(result.status);
        document.cookie = `cookie-1 = ${result.data.token}`;

        if (result.status === 201) {
          console.log(result.data);
          setTimeout(() => {
            navigate('/home');
          }, 500);
          toast.success(`Sucessfully Loged in `, {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else if (result.status === 502) { // Change the condition to check for status 400
          toast.error(`login-failed`, {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      } catch (error) {
        console.error("An error occurred:", error);
        toast.error(`login-failed`, {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }
  }
  useEffect(() => {
    autoLogin();
    return () => {
    };
  }, [cookie.get("cookie-1")]);


  return (
    <div className="login-container">
      <ToastContainer />

      <div className="login-box">
        <h2>Farmer Login</h2>
        <h4>Enter your registered Email:</h4>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Enter your email address'
          required
        />
        <h4>Enter your Password corresponding email address:</h4>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='Enter your password'
          required
        />
        <button onClick={handleLogin}>Login</button>
        <div className="additional-options">
          <p>
            Don't have an account? <a href="/signup">Sign Up</a>
          </p>
          <p>
            <a href="/forgotpassword">Forgot Password?</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FarmerLogin;
