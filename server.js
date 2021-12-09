const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const multer = require("multer");

mongoose.connect("mongodb://localhost:27017/galleryDB", {
  useUnifiedTopology: true,
});

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.static("images"));

imageSchema = new mongoose.Schema({
  imageDescription: String,
  image: String,
  wish: String,
});

imageModel = mongoose.model("Image", imageSchema); //create model out of the imageSchema schema

//setting multer

let upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./images");
    },
    filename: function (req, file, cb) {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  }),
});

app.get("/admin", (req, res) => {
  res.render("admin");
});

app.post("/upload", upload.single("userFile"), (req, res) => {
  console.log(req.file);

  let newImage = new imageModel();
  newImage.imageDescription = req.body.description;
  newImage.image = req.file.filename;
  newImage.wish = req.body.userWish;

  newImage.save((error, document) => {
    if (!error) {
      console.log("file saved");
      res.redirect("/random");
    } else {
      console.log(error);
    }
  });
});

app.get("/random", (req, res) => {
  imageModel.find().then((document) => {

    const randomElement = Math.floor(Math.random() * document.length);
    let randomRecord = document[randomElement];

    console.log(randomRecord);

    //console.log(document);
    //console.log(randomRecord);
    
    res.render("random", { item: randomRecord });
    //res.render("random", randomRecord);
    
  });
});

app.get("/", (req, res) => {
  imageModel.find().then((document) => {
    // console.log(document);
    res.render("index", { item: document });
  });
});
const port = 5000;

app.listen(port, () => {
  console.log(`Server is running on Port ${port}.`);
});
