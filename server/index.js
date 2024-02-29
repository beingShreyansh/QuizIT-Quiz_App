const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config({ path: "./.env" });

const app = express();
const PORT = process.env.PORT || 3001;

const { authRouter, adminRouter, userRouter, quizRouter } = require("./routes");
const { dbConnection } = require("./dbConfig");

dbConnection()

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000", 
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 204,
  })
);

app.use("/auth", authRouter);
app.use("/admin", adminRouter);
app.use("/user", userRouter);
app.use("/quiz", quizRouter);

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
