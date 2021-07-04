import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import CreditCardCheckout from "../components/CreditCardCheckout";
import IdealPaymentCheckout from '../components/IdealPaymentCheckout';
import Paypal from "../components/PayPal";
import "../stripe.css";

// load stripe outside of components render to avoid recreating stripe object on every render
const promise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

const Payment = () => {
  return (
    <div className="container p-5 text-center">
      <h4>Complete your purchase</h4>
      <Elements stripe={promise}>
        <div className="col-md-8 offset-md-2">
          <CreditCardCheckout />
        </div>
      </Elements>
      <Elements stripe={promise}>
        <div className="col-md-8 offset-md-2">
          <IdealPaymentCheckout />
        </div>
      </Elements>
      <div className="col-md-8 offset-md-2">
          <Paypal/>
        </div>
    </div>
  );
};

export default Payment;