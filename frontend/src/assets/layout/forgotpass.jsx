import React, { useState } from "react";
import axios from "axios";
import '../styles/sendotp.css';

function ForgotPassword() {
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSendOtp = async (e) => {
    e.preventDefault();
    // Add your logic for sending OTP here

    // After sending OTP, show the OTP form
    setShowOtpForm(true);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    // Add your logic for verifying OTP here
  };

  return (
    <div className="reset-pass">
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