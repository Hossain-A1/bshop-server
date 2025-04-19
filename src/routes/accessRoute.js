const express = require("express");
const { isAuthorized, isAdmin } = require("../middlewares/isAuth");
const { handleAccessAdmin } = require("../controllers/accessController");
const accessRouter = express.Router();

accessRouter.post("/admin", isAuthorized, isAdmin, handleAccessAdmin);

module.exports = accessRouter;
