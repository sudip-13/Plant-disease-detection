const express = require("express");
const {
    UserModel,
  } = require("../models/user");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });
const {createAndSendToken,transporter}=require('../middleware/auth')
const cloudinary = require("cloudinary").v2;
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_secret
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });
  async function Register(req, res) {
    const { FullName, email, password, confirmPassword, indetityNumber } = req.body;

    try {
        
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Password and confirmPassword do not match" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const hashedindetityNumber = await bcrypt.hash(indetityNumber, 10);


        let avatarUrl = null; 


        if (req.file && req.file.path) {
         
            const result = await cloudinary.uploader.upload(req.file.path);
            avatarUrl = result.url; 
        }

        // Create a new user
        const newUser = new UserModel({
            FullName: FullName,
            email: email,
            Password: hashedPassword,
            ConfirmPassword: hashedPassword, // Store hashedPassword in ConfirmPassword field
            IdentityNumber: hashedindetityNumber,
            avatarUrl: avatarUrl, 
        });

        
        await newUser.save();
        createAndSendToken(newUser, 201, res);
        
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error", error: err });
    }
}

async function login(req, res){
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ message: "USer not found" });
        }
        const isMatch = await bcrypt.compare(password, user.Password);
       
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const newUser = {
            email: user.email,
            avatarUrl: user.avatarUrl,
            FullName:user.FullName
        }        
        createAndSendToken(newUser, 201, res);

        // return res.status(200).json({ message: "Login successful" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error", error: err });
    }
}
async function welcome(req, res) {
    res.status(200).json("welcome");
  }
  async function decodeJWT(req, res) {
    const token = req.body.token;
    console.log("try to extract email");
    if (!token) {
      return res.status(400).json({ error: "Token not provided" });
    }
    try {
      const decoded = jwt.verify(token, secret);
      const email = decoded.username.email;
      const profileURL = decoded.username.avatar;
      const fullName = decoded.username.FullName
      res
        .status(201)
        .json({ email: email, profileURL: profileURL ,fullName: fullName });
    } catch (error) {
        console.log(error);
      res.status(401).json({ error: "Invalid token"});
    }
  }
  async function generateOtp(req, res) {
    const email = req.body;
    let newotp = "";
    for (let i = 0; i <= 3; i++) {
      newotp += Math.floor(Math.random() * 10).toString();
    }
    try {
      const user = await UserModel.findOneAndUpdate(
        email,
        { $set: { otp: newotp } },
        { new: true }
      );
      const mailOptions = {
        from: "bikikutta25@gmail.com",
        to: email.email,
        subject: "OTP-Verification",
        text: `Please use the code below to confirm your email address. This code will expire in 2 hours. If you don't think you should be receiving this email, you can safely ignore it. 
          ${newotp}`,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
      if (user) {
        res.status(200).send({ message: "Otp Success" });
      } else {
        res.status(404).send({ message: "No existing admin found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "OTP generation failed" });
    }
  }
  
  async function otpValidation(req, res) {
    const { email, otp, newPassword } = req.body;
    console.log(email, newPassword,otp);
    const hashednewPassword = await bcrypt.hash(newPassword, 10);

    console.log(email);
    console.log(otp);
    try {
        const user = await UserModel.findOneAndUpdate(
            { email: email, otp: otp },
            { 
                $set: { 
                  Password: hashednewPassword,
                  ConfirmPassword: hashednewPassword 
                } 
            },
            { new: true }
        );
        if (user) {
            console.log("Validation Success");
            res.status(202).json({ success: true });
        } else {
            console.log("Validation Failed");
            res.status(401).json("Invalid OTP");
        }
    } catch (error) {
        console.error(error);
        res.status(502).send({ message: "OTP validation failed, Internal server error" });
    }
}


  
  /*async function resetPassword(req, res) {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.findOneAndUpdate(
      { email: email },
      { $set: { password: hashedPassword } },
      { new: true }
    );
    if (user) {
      res.status(201).send({ message: "Password reseted" });
    } else {
      res.status(502).send("password reset process failed");
    }
  }*/
module.exports = { Register,login,welcome,decodeJWT,generateOtp,otpValidation}