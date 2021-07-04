import React, { useState, useEffect } from "react";
import {CardElement, useStripe, useElements, IdealBankElement} from '@stripe/react-stripe-js';
import { useSelector, useDispatch } from "react-redux";
import { createPaymentIntent } from "../functions/stripe";
import IdealBankSection from './IdealBankSection';
import { Link } from "react-router-dom";
import { Card } from "antd";
import { DollarOutlined, CheckOutlined, SwapOutlined } from "@ant-design/icons";
import Laptop from "../images/mooi.jpeg";
import { createOrder, emptyUserCart } from "../functions/user";

export default function IdealPaymentCheckoutForm() {
  const dispatch = useDispatch();
  const { user, coupon } = useSelector((state) => ({ ...state }));

  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState("");

  const [cartTotal, setCartTotal] = useState(0);
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
  const [payable, setPayable] = useState(0);

  const stripe = useStripe();
  const elements = useElements();


  useEffect(() => {
    createPaymentIntent(user.token).then((res) => {
      console.log("create payment intent", res.data);
      setClientSecret(res.data.clientSecret);
      // additional response received on successful payment
      setCartTotal(res.data.cartTotal);
      // setTotalAfterDiscount(res.data.totalAfterDiscount);
      setPayable(res.data.payable);
    });
  }, []);

  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const idealBank = elements.getElement(IdealBankElement);
    const accountholderName = event.target['accountholder-name'];

    // For brevity, this example is using uncontrolled components for
    // the accountholder's name. In a real world app you will
    // probably want to use controlled components.
    // https://reactjs.org/docs/uncontrolled-components.html
    // https://reactjs.org/docs/forms.html#controlled-components


    const payload = await stripe.confirmIdealPayment(clientSecret, {
      payment_method: {
        ideal: idealBank,
        // payment_method: {ideal: idealBank},
        billing_details: {
          name: accountholderName.value,
        },
      },
      return_url: 'https://example.com/checkout/complete',
    });

    if (payload.error) {
      setError(`Payment failed ${payload.error.message}`);
      setProcessing(false);
    } else {
      // here you get result after successful payment
      // create order and save in database for admin to process
      createOrder(payload, user.token).then((res) => {
        if (res.data.ok) {
          // empty cart from local storage
          if (typeof window !== "undefined") localStorage.removeItem("cart");
          // empty cart from redux
          dispatch({
            type: "ADD_TO_CART",
            payload: [],
          });
          // reset coupon to false
          dispatch({
            type: "COUPON_APPLIED",
            payload: false,
          });
          // empty cart from database
          emptyUserCart(user.token);
        }
      });
      // empty user cart from redux store and local storage
      console.log(JSON.stringify(payload, null, 4));
      setError(null);
      setProcessing(false);
      setSucceeded(true);
    }
  };

    // Otherwise the customer will be redirected away from your
    // page to complete the payment with their bank.



  return (
    <form onSubmit={handleSubmit}>

      <div className="form-row">
        <label>
          Name
          <input name="accountholder-name" placeholder="Jenny Rosen" required />
        </label>
      </div>
      <div className="form-row">
        <IdealBankSection />
      </div>
      <button type="submit" disabled={!stripe || processing || succeeded}>
        Submit Payment
      </button>
    </form>
  );
}