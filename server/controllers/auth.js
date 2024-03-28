const express = require("express");
const {
    UserModel,
  } = require("../models/user");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });
const {createAndSendToken}=require('../middleware/auth')
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
        // Check if password and confirmPassword match
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Password and confirmPassword do not match" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const hashedindetityNumber = await bcrypt.hash(indetityNumber, 10);


        let avatarUrl = null; // Initialize avatarUrl to null


        if (req.file && req.file.path) {
            // Upload image to cloudinary
            const result = await cloudinary.uploader.upload(req.file.path);
            avatarUrl = result.url; // Set avatarUrl to the uploaded image URL
        }

        // Create a new user
        const newUser = new UserModel({
            FullName: FullName,
            email: email,
            Password: hashedPassword,
            ConfirmPassword: hashedPassword, // Store hashedPassword in ConfirmPassword field
            IdentityNumber: hashedindetityNumber,
            avatarUrl: avatarUrl, // Set avatarUrl
        });

        // Save the new user to the database
        await newUser.save();
        createAndSendToken(newUser, 201, res);
        // return res.status(200).json({ message: "Signup successful" });
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
module.exports = { Register,login,welcome,decodeJWT}