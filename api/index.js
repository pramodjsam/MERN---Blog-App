const express = require("express");
const path = require("path");
const colors = require("colors");
const dotenv = require("dotenv");
const multer = require("multer");
const cors = require("cors");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/users");
const postRouter = require("./routes/posts");
const categoryRouter = require("./routes/categories");
const mongoose = require("mongoose");

dotenv.config({ path: "./api/.env" });

mongoose
  .connect(process.env.MONGO_URL)
  .then((conn) => {
    console.log(`MONGODB: ${conn.connections[0].host}`.cyan.underline);
  })
  .catch((err) => {
    console.log(`${err}`.red.underline);
  });

const app = express();

app.use(express.json());
app.use("/images", express.static(__dirname + "/images/"));
app.use(cors());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./api/images");
  },
  filename: function (req, file, cb) {
    // const regex = /\s|\(|\)/g;
    // const name = file.originalname.replace(regex, "_");
    cb(null, req.body.name);
  },
});

const upload = multer({ storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json("File has been uploaded successfully");
});

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/categories", categoryRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/build/index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("backend working");
  });
}

app.listen(4000, () => {
  console.log("Listening on port 4000".yellow.bold);
});
