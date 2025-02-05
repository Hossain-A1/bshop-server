const express = require("express");
const morgan = require("morgan");
const hpp = require("hpp");
const helmet = require("helmet");
const xssClean = require("xss-clean");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const { errorResponse } = require("./controllers/resController");
const productRouter = require("./routes/productRoute");
const  userRouter  = require("./routes/userRoute");

const app = express();

const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, //1 minute
  max: 20,
  message: "Too many rquest from this api please try again after 1 minute",
});

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(hpp());
app.use(helmet());
app.use(rateLimiter);
app.use(xssClean());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//test route
app.get("/", (req, res) => {
  res.status(200).json({ message: "test successfull" });
});
//bypass all routes
app.use("/api/product", productRouter);
app.use("/api/auth", userRouter);

// client error
app.use((req, res) => {
  return errorResponse(res, { statusCode: 404, message: "Route not found" });
});

// server error handling --> all errors
app.use((err, req, res, next) => {
  return errorResponse(res, { statusCode: err.status, message: err.message });
});

module.exports = app;
