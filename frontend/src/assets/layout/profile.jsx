import React, { useEffect, useState, useCallback } from "react";
import '../styles/profile.css'
import cookie from "js-cookie";
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';

const Profile = () => {
  const token = cookie.get("cookie-1");
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [validated, setValidated] = useState(false);


  const validateUser = async (token) => {
    try {
      const result = await axios.post("http://localhost:4040/verifyjwt", { token });
      if (result.status === 200) {
        console.log('User logged in');
      } else {
        console.log('You are not eligible to access this route! Please login first');
        handleLogout('You are not eligible to access this route! Please login first');
      }
    } catch (error) {
      console.log('You are not eligible to access this route! Please login first');
      handleLogout('You are not eligible to access this route! Please login first');
    }
  };

  const decodeToken = async (token) => {
    try {
      const result = await axios.post("http://localhost:4040/decodejwt", { token });
      if (result.status === 201) {
        console.log(result.data);
        setAvatar(result.data.profileURL);
        setFullName(result.data.fullName);
        setEmail(result.data.email);
      } else {
        console.log('You are not eligible to access this route! Please login first');
        handleLogout('You are not eligible to access this route! Please login first');
      }
    } catch (error) {
      console.log('You are not eligible to access this route! Please login first');
      handleLogout('You are not eligible to access this route! Please login first');
    }
  };
  const handleLogout = (msg) => {
    if (msg === 'logged out') {
      toast.success(`${msg}`, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      document.cookie = 'cookie-1' +
        '=; expires=Thu, 01-Jan-70 00:00:01 GMT;';
    } else {
      toast.error(`${msg}`, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
    setTimeout(() => {
      navigate('/');
    }, 1500);
  }

  useEffect(() => {
    const token = cookie.get("cookie-1");
    if (token && !validated) {
      validateUser(token);
      decodeToken(token);
      setValidated(true);
    }
  }, [validated, cookie.get("cookie-1")]);
  return (
    <div className="profile">
      <ToastContainer />
      <div className="profile-container">
        <div className="profile-picture">
          <img src={avatar} alt="profile" />
        </div>
        <div className="user-details">
          <h2>{fullName}</h2>
          <p><b>Email :</b> {email}</p>

        </div>
        <div className="edit-profile">
          <button onClick={() => handleLogout('logged out')} >Logout</button>
        </div>
      </div>
    </div>
  );
}
export default Profile;