const express = require("express");
<<<<<<< HEAD
const mysql = require("mysql");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config({ path: "./.env" });

const app = express();
const PORT = process.env.PORT || 3001;

const { authRouter, adminRouter, userRouter } = require("./routes");

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

db.connect((error) => {
  if (error) {
    console.error("MySQL connection error:", error);
  } else {
    console.log("MySQL connected");
  }
});

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your frontend's URL
=======
const {
  //  quizRouter,
  //  authRouter,
  adminRouter,
  userRouter,
} = require("./routes");
const cors = require("cors");
const app = express();

const PORT = 3001;

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
>>>>>>> 30cc81be6f773d9d1cafad42a8e080c0c0e3fb5b
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 204,
  })
);

<<<<<<< HEAD
app.use("/auth", authRouter);
app.use("/admin", adminRouter);
app.use("/user", userRouter);

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
=======
// app.use('/auth', authRouter);
app.use("/admin", adminRouter);
app.use("/user", userRouter);
// app.use('/quiz', quizRouter);

app.listen(PORT, () => {
  console.log(`Server started at ${PORT}`);
>>>>>>> 30cc81be6f773d9d1cafad42a8e080c0c0e3fb5b
});
