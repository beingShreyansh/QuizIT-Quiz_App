const express = require("express");
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
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 204,
  })
);

// app.use('/auth', authRouter);
app.use("/admin", adminRouter);
app.use("/user", userRouter);
// app.use('/quiz', quizRouter);

app.listen(PORT, () => {
  console.log(`Server started at ${PORT}`);
});
