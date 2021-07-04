const User = require("../models/user");
const Cart = require("../models/cart");
const Product = require("../models/product");
// const Coupon = require("../models/coupon");
const stripe = require("stripe")(process.env.STRIPE_SECRET);
// const paypal = require(process.env.PAYPAL_SECRET);

exports.createPaymentIntent = async (req, res) => {
  // later apply coupon
  // later calculate price

  // 1 find user
  const user = await User.findOne({ email: req.user.email }).exec();
  // 2 get user cart total
  const { cartTotal } = await Cart.findOne({ orderdBy: user._id }).exec();

  console.log("CART TOTAL CHARGED", cartTotal);
  // create payment intent with order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: cartTotal * 100,
    currency: "EUR",
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
};

exports.createIdealPaymentIntent = async (req, res) => {
  // later apply coupon
  // later calculate price

  // 1 find user
  const user = await User.findOne({ email: req.user.email }).exec();
  // 2 get user cart total
  const { cartTotal } = await Cart.findOne({ orderdBy: user._id }).exec();

  console.log("CART TOTAL CHARGED", cartTotal);
  // create payment intent with order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: cartTotal * 100,
    currency: "EUR",
    payment_method_types: 'ideal',
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });

};

exports.createPayPalIntent = async (req, res) => {
  const user = await User.findOne({ email: req.user.email }).exec();
  const { cartTotal } = await Cart.findOne({ orderdBy: user._id }).exec();

  console.log("CART TOTAL CHARGED", cartTotal);
  const paymentIntent = await paypal.paymentIntents.create({
    amount: cartTotal * 100,
    currency: "EUR",
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
};

