const customerOrderModel = require("../models/customerOrderModel");
const userModel = require("../models/userModel");
const { successResponse } = require("./resController");

const handleCreateOrder = async (req, res, next) => {
  try {
    const userId = req.user;

    const { price, products, shippingInfo } = req.body;

    const orderData = {
      price,
      products,
      shippingInfo,
      payment_status: false,
      delivery_status: "processing",
      paymentMethod: "COD",
      date: Date.now(),
    };

    const order = await customerOrderModel.create(orderData);
    await userModel.findByIdAndUpdate(userId, { cartItem: {} }, { new: true });

    return successResponse(res, {
      statusCode: 201,
      message: "order was created successfully!",
      payload:order
    });
  } catch (error) {
    next(error);
  }
};


module.exports ={handleCreateOrder}