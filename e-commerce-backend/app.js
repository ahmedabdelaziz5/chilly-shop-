const express = require("express");
const path = require("path");

const app = express();
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "images"));
  },
  filename: (req, file, cb) => {
    cb(null, `${new Date().getTime()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype == ("image/png" || "image/jpg" || "image/jpeg")) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};


const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());

app.use(multer({ storage: fileStorage, fileFilter }).single("image"));

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

// handles error and non-existent pages

app.use((req, res, next) => {
  res.status(404).send("<h1>Oh oh, this page does not exist</h1>");
  next();
});

// connects the server to the database

mongoose
  .connect(
    process.env.CONNECTION_STRING,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(result => {
    console.log("Database connected");
    app.listen(3000);
  })
  .catch(err => console.log(err));
