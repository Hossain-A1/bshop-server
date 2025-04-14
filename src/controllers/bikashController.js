const axios = require("axios");
const globals = require("node-global-storage");
const { v4: uuidv4 } = require("uuid");
const bikashModel = require("../models/bikashModel");
const { clientURL } = require("../secret");
const userModel = require("../models/userModel");

// Helper function to generate headers
const bkashHeaders = async () => ({
  "Content-Type": "application/json",
  Accept: "application/json",
  authorization: globals.getValue("id_token"),
  "x-app-key": process.env.bkash_api_key,
});

// Function to create a payment
const handlePaymentCreate = async (req, res, next) => {
  const { amount } = req.body;
  const userId = req.user;
  globals.setValue("userId", userId); // Store userId temporarily

  try {
    const response = await axios.post(
      process.env.bkash_create_payment_url,
      {
        mode: "0011",
        payerReference: " ",
        callbackURL: `${clientURL}/api/bkash/payment/callback`,
        amount,
        currency: "BDT",
        intent: "sale",
        merchantInvoiceNumber: "Inv" + uuidv4().substring(0, 5),
      },
      {
        headers: await bkashHeaders(),
      }
    );

    if (response.data.statusCode === "0000") {
      return res.status(200).json({ bkashURL: response.data.bkashURL });
    } else {
      return res.status(400).json({ message: "Payment initiation failed" });
    }
  } catch (error) {
    next(error);
  }
};

// Function to handle payment callback
const handleCallBack = async (req, res) => {
  const { paymentID, status, userId } = req.query; // Get userId from query

  if (status === "cancel" || status === "failure") {
    return res.redirect(`${clientURL}/cancel`);
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
        // Save transaction in DB with correct userId
        await bikashModel.create({
          userId, // ✅ Store correct user ID
          paymentID,
          trxID: data.trxID,
          date: data.paymentExecuteTime,
          amount: parseInt(data.amount),
        });

        // Clear the cart only after payment is successful
        await userModel.findByIdAndUpdate(userId, { cartItem: {} });

        return res.redirect(`${clientURL}/success`);
      } else {
        return res.redirect(`${clientURL}/error?message=${data.statusMessage}`);
      }
    } catch (error) {
      return res.redirect(`${clientURL}/error?message=${error.message}`);
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
      return res.status(200).json({ message: "Refund successful" });
    } else {
      return res.status(400).json({ error: "Refund failed" }); // Fixed status code
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
