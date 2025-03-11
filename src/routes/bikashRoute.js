const express = require("express");
const {
  handlePaymentCreate,
  handleCallBack,
  handleRefund,
} = require("../controllers/bikashController");
const bkashAuth = require("../middlewares/bikash");
const bikashRoute = express.Router();

bikashRoute.post("/payment/create",bkashAuth, handlePaymentCreate);
bikashRoute.get("/payment/callback",bkashAuth, handleCallBack);
bikashRoute.get("/payment/refund/:trxID",bkashAuth, handleRefund);

module.exports = bikashRoute;
