import React, { useState } from "react";
import axios from "axios";
import '../styles/sendotp.css';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';

function ForgotPassword() {
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post("http://localhost:4040/generateotp", { email });
      if (result.status === 200) {
        setShowOtpForm(true);
        toast.success(`OTP generate sucessful `, {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (err) {
      console.log(err);
      toast.error(`${err.message}`, {
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

  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try{
      const result = await axios.post("http://localhost:4040/resetpassword", { email,otp,newPassword });
      if (result.status === 202) {
        toast.success(`Password changed sucessfully`, {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setTimeout(() => {
          navigate('/');
        }, 1500);
    }
  }
  catch (e) {
    console.log(e);
    toast.error(`${e.message}`, {
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

  };

  return (
    <div className="reset-pass">
      <ToastContainer/>
      <h2>Reset Password</h2>
      <form id="email-Form" onSubmit={handleSendOtp}>
        <input
          required
          placeholder="Enter your Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Send OTP</button>
      </form>

      {showOtpForm && (
        <>
          <h2>OTP VERIFICATION</h2>
          <form id="otp-Form" onSubmit={handleVerifyOtp}>
            <input
              type="text"
              placeholder="Enter OTP"
              id="otp"
              name="otp"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <input
              type="text"
              placeholder="Enter new password"
              id="newpass"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button type="submit">Verify</button>
          </form>
        </>
      )}
    </div>
  );
}

export default ForgotPassword;