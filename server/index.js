const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const UserRouter=require('./router/user')

const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });
const DB = process.env.db;
const PORT = process.env.PORT;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/files", express.static("files"));
app.use(cookieParser());

mongoose
  .connect(DB)
  .then(console.log("DB connected"))
  .catch((error) => console.log("DB connection failed", error));

app.use("/",UserRouter);

  
app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
  });