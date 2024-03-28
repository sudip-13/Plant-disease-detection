import React, { useState,useCallback,useEffect } from 'react';
import '../styles/signup.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import cookie from "js-cookie";

const SignupForm = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [identityNumber, setIdentityNumber] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);

  const autoLogin = useCallback( async () => {
  const token = cookie.get("cookie-1");

    try {
      const result = await axios.post("http://localhost:4040/verifyjwt", { token: token });
      // console.log(result);
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
      } else if (result.status === 200) {
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
    } catch (error) {
      console.error("Server error autologin failed", error);
    }
  },[navigate]);



  const handleSignup = async () => {
    if (fullName === '' || password === '' || confirmPassword === '' || identityNumber === '') {
      alert('Please fill in all fields.');
    } else if (password !== confirmPassword) {
      alert('Passwords do not match.');
    } else {
      const formdata = new FormData();
      formdata.append('FullName', fullName);
      formdata.append('email', email);
      formdata.append('password', password);
      formdata.append('confirmPassword', confirmPassword);
      formdata.append('indetityNumber', identityNumber);
      formdata.append('avatar', profilePicture);
  
      try {
        const result = await axios.post("http://localhost:4040/signup", formdata);
        if (result.status === 201) {
          console.log(result.data);
          document.cookie = `cookie-1 = ${result.data.token}`;
          setTimeout(() => {
            navigate('/');
          }, 500);
          toast.success(`Signup successful`, {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            className: "toast-background",
          });
       
        } else {
          console.log("Failed to update ");
          toast.error(`Failed to update`, {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            className: "toast-background",
          });
        }
      } catch (err) {
        console.log(err);
        toast.error(`${err}`, {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          className: "toast-background",
        });
      }
    }
  };
  
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
    }
  };
  useEffect(() => {
    autoLogin();
    return()=>{

    }
  }, [autoLogin]);
  return (
    <div className="signup-container">
      <ToastContainer />
      <div className="signup-box">
        <header>Signup</header>
        <label>Enter Your Full Name:</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <label>Enter a Password which you can remeber:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label>Password and Confirm Password must be same:</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <label>Enter Your Email:</label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {/* <label>Select Identity Proof:</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              value="aadhar card"
              checked={identityProof === 'aadhar card'}
              onChange={() => setIdentityProof('aadhar card')}
            />
            Aadhar Card
          </label>
          <label>
            <input
              type="radio"
              value="driverLicense"
              checked={identityProof === 'driverLicense'}
              onChange={() => setIdentityProof('driverLicense')}
            />
            Driver's License
          </label>
          <label>
            <input
              type="radio"
              value="Voter Id"
              checked={identityProof === 'Voter Id'}
              onChange={() => setIdentityProof('Voter Id')}
            />
            Passport
          </label> */}
        {/* </div> */}
        <label>Identity Number:</label>
        <input
          type="text"
          value={identityNumber}
          onChange={(e) => setIdentityNumber(e.target.value)}
          required
        />
        <label>Upload Profile Picture:</label>
        <input type="file" accept="image/*" onChange={handleProfilePictureChange} />
        <button onClick={handleSignup}>Signup</button>
      </div>
    </div>
  );
};

export default SignupForm;
