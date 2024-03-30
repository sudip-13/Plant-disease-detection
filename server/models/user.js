const mongoose = require("mongoose");

const user = new mongoose.Schema(
    {
     
        email: {
            type: String,
            required: true,
            unique: true,

        },
        FullName:{
            type: String,
            required: true,
        },
        Password:{
            type: String,
            required: true
        },
        ConfirmPassword:{
            type: String,
            required: true
        },
        IdentityNumber:{
            type: String,
            required: true
        },
        avatarUrl:{
            type: String,
        },
        otp:{
            type: Number,
        },
    },
    {
        timestamps: true,
    }
);



const UserModel = mongoose.model("Users_plant", user);
module.exports = {
    UserModel
}