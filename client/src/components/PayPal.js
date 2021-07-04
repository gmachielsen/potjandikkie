import React, { useState, useEffect } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useSelector, useDispatch } from "react-redux";
import { createPaymentIntent } from "../functions/stripe";
import { Link } from "react-router-dom";
import { Card } from "antd";

import { createOrder, emptyUserCart } from "../functions/user";


const Paypal = ({ history }) => {
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
  

       useEffect(() => {
      createPaymentIntent(user.token, coupon).then((res) => {
        console.log("create payment intent", res.data);
        setClientSecret(res.data.clientSecret);
        // additional response received on successful payment
        setCartTotal(res.data.cartTotal);
        setTotalAfterDiscount(res.data.totalAfterDiscount);
        setPayable(res.data.payable);
        console.log(cartTotal, "<<-- cart total");

      });
    }, []);

        const createOrder = (data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: "14",
                },
              },
            ],
          });
        };
      
        const onApprove = (data, actions) => {
            // createOrder(data, user.token).then((res) => {
            //     if (res.data.ok) {
            //       // empty cart from local storage
            //       if (typeof window !== "undefined") localStorage.removeItem("cart");
            //       // empty cart from redux
            //       dispatch({
            //         type: "ADD_TO_CART",
            //         data: [],
            //       });
            //       // reset coupon to false
            //       dispatch({
            //         type: "COUPON_APPLIED",
            //         data: false,
            //       });
            //       // empty cart from database
            //       emptyUserCart(user.token);
            //     }
            //   });
            //   // empty user cart from redux store and local storage
            //   console.log(JSON.stringify(data, null, 4));
            //   setError(null);
            //   setProcessing(false);
            //   setSucceeded(true);
          return actions.order.capture();

        };
return (
    <PayPalScriptProvider options={{ "client-id": "test" }}>
        <PayPalButtons createOrder={(data, actions) => createOrder(data, actions)}
        onApprove={(data, actions) => onApprove(data, actions)} style={{ layout: "horizontal" }} />
    </PayPalScriptProvider>
);

}


export default Paypal;


  
    // useEffect(() => {
    //   createPaymentIntent(user.token, coupon).then((res) => {
    //     console.log("create payment intent", res.data);
    //     setClientSecret(res.data.clientSecret);
    //     // additional response received on successful payment
    //     setCartTotal(res.data.cartTotal);
    //     setTotalAfterDiscount(res.data.totalAfterDiscount);
    //     setPayable(res.data.payable);
    //   });
    // }, []);
  
    // const handleSubmit = async (e) => {
    //   e.preventDefault();
    //   setProcessing(true);
  
    //   const data = await stripe.confirmCardPayment(clientSecret, {
        
    //     payment_method: {
    //       card: elements.getElement(CardElement),  
    //       billing_details: {
    //         name: e.target.name.value,
    //       },
    //     },
    //   });
    //   if (data.error) {
    //     setError(`Payment failed ${data.error.message}`);
    //     setProcessing(false);
    //   } else {
    //     // here you get result after successful payment
    //     // create order and save in database for admin to process
    //     createOrder(data, user.token).then((res) => {
    //       if (res.data.ok) {
    //         // empty cart from local storage
    //         if (typeof window !== "undefined") localStorage.removeItem("cart");
    //         // empty cart from redux
    //         dispatch({
    //           type: "ADD_TO_CART",
    //           data: [],
    //         });
    //         // reset coupon to false
    //         dispatch({
    //           type: "COUPON_APPLIED",
    //           data: false,
    //         });
    //         // empty cart from database
    //         emptyUserCart(user.token);
    //       }
    //     });
    //     // empty user cart from redux store and local storage
    //     console.log(JSON.stringify(data, null, 4));
    //     setError(null);
    //     setProcessing(false);
    //     setSucceeded(true);
    //   }
    // };


    // const paypal = "https://www.paypal.com/sdk/js?client-id=Ae7VN88oDv29ZNHg_vuoFAJ5SOJqNR_lp5CReR7UtQGP8MSMV_Ge5AbG1uGcAOQNstSFyBS-oZuBsOmT&currency=EUR"
    // const paypal = process.env.PAYPAL_CLIENT_ID
//     const paypal = useRef("https://www.paypal.com/sdk/js?client-id=Ae7VN88oDv29ZNHg_vuoFAJ5SOJqNR_lp5CReR7UtQGP8MSMV_Ge5AbG1uGcAOQNstSFyBS-oZuBsOmT&currency=EUR")

//     useEffect(() => {
//         window.paypal.Buttons({
//             createOrder: (data, actions, err) => {
//                 return actions.order.create({
//                     intent: "Capture",
//                     purchase_units: [
//                         {
//                             description: "Cool looking table",
//                             amount: {
//                                 currency_code: "EUR",
//                                 value: 2.00,
//                             }
//                         }
//                     ]
//                 })
//             },
//             onApprove: async (data, actions) => {
//                 const order = await actions.order.capture();
//                 console.log(order);
//             },
//             onError: (err) => {
//                 console.log(err);
//             }
//         }).render(paypal.current);
//     }, []);

//     return (
//         <div>
//             <div ref={paypal}></div>
//         </div>
//     )

// const initialOptions = {
//     "client-id": "test",
//     currency: "USD",
//     intent: "capture",
//     "data-client-token": "abc123xyz==",
// };

//     return (
//         <PayPalScriptProvider options={initialOptions}>
//             <PayPalButtons />
//         </PayPalScriptProvider>
//     );












// import React, { useState, useEffect } from "react";
// import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
// import { useSelector, useDispatch } from "react-redux";
// import { createPaymentIntent } from "../functions/stripe";
// import { Link } from "react-router-dom";
// import { Card } from "antd";

// import { createOrder, emptyUserCart } from "../functions/user";


// const Paypal = ({ history }) => {
//     const dispatch = useDispatch();
//     const { user, coupon } = useSelector((state) => ({ ...state }));
  
//     const [succeeded, setSucceeded] = useState(false);
//     const [error, setError] = useState(null);
//     const [processing, setProcessing] = useState("");
//     const [disabled, setDisabled] = useState(true);
//     const [clientSecret, setClientSecret] = useState("");
  
//     const [cartTotal, setCartTotal] = useState(0);
//     const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
//     const [payable, setPayable] = useState(0);
  
//         const createOrder = (data, actions) => {
//           return actions.order.create({
//             purchase_units: [
//               {
//                 amount: {
//                   value: "0.14",
//                 },
//               },
//             ],
//           });
//         };
      
//         const onApprove = (data, actions) => {
//           return actions.order.capture();
//         };
// return (
//     <PayPalScriptProvider options={{ "client-id": "test" }}>
//         <PayPalButtons createOrder={(data, actions) => createOrder(data, actions)}
//         onApprove={(data, actions) => this.onApprove(data, actions)} style={{ layout: "horizontal" }} />
//     </PayPalScriptProvider>
// );

// }