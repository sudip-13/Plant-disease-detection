const express = require('express');
const UserRouter = express.Router();
const multer = require('multer');


const {
    Register,login,welcome,decodeJWT
} = require("../controllers/auth");

const {verifyToken}=require('../middleware/auth')

const storage = multer.diskStorage({});
const upload = multer({ storage });


UserRouter.post("/signup", upload.single('avatar'), Register);

UserRouter.post("/login", login);
UserRouter.post("/verifyjwt",verifyToken, welcome);
UserRouter.post("/decodejwt",decodeJWT);


module.exports = UserRouter;