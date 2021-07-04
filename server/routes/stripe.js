const express = require("express");
const router = express.Router();

const { createPaymentIntent, createIdealPaymentIntent, createPayPalPaymentIntent } = require("../controllers/stripe");
const { route } = require("./user");
// middleware
const { authCheck } = require("../middlewares/auth");

router.post("/create-payment-intent", authCheck, createPaymentIntent);
router.post("/create-ideal-payment-intent", authCheck, createIdealPaymentIntent)
// router.post("/create-paypal-payment-intent", authCheck, createPayPalPaymentIntent)

module.exports = router;
