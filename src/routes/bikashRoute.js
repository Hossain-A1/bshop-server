const express = require("express");
const {
  handlePaymentCreate,
  handleCallBack,
  handleRefund,
} = require("../controllers/bikashController");
const bkashAuth = require("../middlewares/bikash");
const { isAuthorized } = require("../middlewares/isAuth");
const bikashRoute = express.Router();

bikashRoute.post(
  "/payment/create",
  isAuthorized,
  bkashAuth,
  handlePaymentCreate
);
bikashRoute.get("/payment/callback", handleCallBack);
bikashRoute.get("/payment/refund/:trxID", bkashAuth, handleRefund);

module.exports = bikashRoute;
