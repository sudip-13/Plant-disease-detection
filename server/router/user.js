const express = require('express');
const UserRouter = express.Router();
const multer = require('multer');


const {
    Register, login, welcome, decodeJWT,generateOtp,otpValidation
} = require("../controllers/auth");

const { verifyToken } = require('../middleware/auth')

const storage = multer.diskStorage({});
const upload = multer({ storage });


UserRouter.post("/signup", upload.single('avatar'), Register);

UserRouter.post("/login", login);
UserRouter.post("/verifyjwt", verifyToken, welcome);
UserRouter.post("/decodejwt", decodeJWT);
UserRouter.post("/generateotp", generateOtp);
UserRouter.post("/resetpassword", otpValidation);





module.exports = UserRouter;