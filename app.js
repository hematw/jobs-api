require("dotenv").config();
require("express-async-errors");
const express = require("express");
const connect = require("./db/connect");
const notFound = require("./middlewares/not-found");
const errorHandler = require("./middlewares/error-handler");
const jobsRouter = require("./routes/jobs");
const authRouter = require("./routes/auth");
const authMiddleware = require("./middlewares/auth-middleware");

// security packages
const helmet = require("helmet");
const cors = require("cors");
const { rateLimit } = require("express-rate-limit");

const app = express();
app.use(
  rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 100,
    message: {
      "msg": "Too many requests, please try again later."
    }
  })
);
app.use(express.json());
app.use(helmet());
app.use(cors());

app.get("/", (req, res) => {
  res.json({ msg: "Hello ATOM Hemat!" });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authMiddleware, jobsRouter);
app.use(notFound);
app.use(errorHandler);

app.listen(process.env.PORT, async () => {
  try {
    await connect(process.env.MONGO_URI);
    console.log("Server is running and MongoDB connected! ✅");
  } catch (error) {
    console.log(error);
  }
});
