const userModel = require("../models/userModel");
const { errorResponse, successResponse } = require("../controllers/resController");

// Function to add an item to the cart (storing only cart length)
const handleAddToCart = async (req, res, next) => {
  try {
    const { count } = req.body; 
    const userId = req.user; 

    if (!count || typeof count !== "number" || count < 1) {
      return errorResponse(res, {
        statusCode: 400,
        message: "Invalid count. Must be a positive number.",
      });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return errorResponse(res, {
        statusCode: 404,
        message: "User not found in database",
      });
    }

    // Update cart length (overwrite or increment)
    user.cartItem = { items: (user.cartItem?.items || 0) + count };

    // Save updated cart
    await user.save();

    return successResponse(res, {
      statusCode: 200,
      message: "Cart length updated successfully",
      payload: { cartItems: user.cartItem.items },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { handleAddToCart };
