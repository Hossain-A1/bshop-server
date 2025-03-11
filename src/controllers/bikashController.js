const axios = require("axios");
const globals = require("node-global-storage");
const { v4: uuidv4 } = require("uuid");
const bikashModel = require("../models/bikashModel");

// Helper function to generate headers
const bkashHeaders = async () => ({
  "Content-Type": "application/json",
  Accept: "application/json",
  authorization: globals.getValue("id_token"),
  "x-app-key": process.env.bkash_api_key,
});

// Function to create a payment
const handlePaymentCreate = async (req, res, next) => {
  const { amount, userId } = req.body;
  globals.setValue("userId", userId);

  try {
    const response = await axios.post(
      process.env.bkash_create_payment_url,
      {
        mode: "0011",
        payerReference: " ",
        callbackURL: "http://localhost:4000/api/bkash/payment/callback",
        amount: amount,
        currency: "BDT",
        intent: "sale",
        merchantInvoiceNumber: "Inv" + uuidv4().substring(0, 5),
      },
      {
        headers: await bkashHeaders(),
      }
    );

    return res.status(200).json({ bkashURL: response.data.bkashURL });
  } catch (error) {
    next(error);
  }
};

// Function to handle payment callback
const handleCallBack = async (req, res) => {
  const { paymentID, status } = req.query;

  // Define the frontend URL manually
  const frontendURL = process.env.FRONTEND_URL || "http://localhost:3000"; 

  if (status === "cancel" || status === "failure") {
    return res.redirect(`${frontendURL}/cancel`);
  }

  if (status === "success") {
    try {
      const { data } = await axios.post(
        process.env.bkash_execute_payment_url,
        { paymentID },
        {
          headers: await bkashHeaders(),
        }
      );

      if (data && data.statusCode === "0000") {
        await bikashModel.create({
          userId: Math.random() * 10 + 1,
          paymentID,
          trxID: data.trxID,
          date: data.paymentExecuteTime,
          amount: parseInt(data.amount),
        });

        return res.redirect(`${frontendURL}/success`);
      } else {
        return res.redirect(`${frontendURL}/error?message=${data.statusMessage}`);
      }
    } catch (error) {
      return res.redirect(`${frontendURL}/error?message=${error.message}`);
    }
  }
};


// Function to handle refund
const handleRefund = async (req, res, next) => {
  const { trxID } = req.params;

  try {
    const payment = await bikashModel.findOne({ trxID });
    if (!payment) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    
    const { data } = await axios.post(
      process.env.bkash_refund_transaction_url,
      {
        paymentID: payment.paymentID,
        amount: payment.amount,
        trxID,
        sku: "payment",
        reason: "cashback",
      },
      {
        headers: await bkashHeaders(),
      }
    );

    if (data && data.statusCode === "0000") {
      return res.status(200).json({ message: "refund success" });
    } else {
      return res.status(404).json({ error: "refund failed" });
    }
  } catch (error) {
    next(error);
  }
};

// Export all functions
module.exports = {
  handlePaymentCreate,
  handleCallBack,
  handleRefund,
};
