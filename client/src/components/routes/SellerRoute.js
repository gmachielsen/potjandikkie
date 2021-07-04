import React, { useEffect, useState } from "react";
import { Route } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingToRedirect from "./LoadingToRedirect";
import { currentSeller } from "../../functions/auth";

const SellerRoute = ({ children, ...rest }) => {
    const { user } = useSelector((state) => ({ ...state }));
    const [ok, setOk] = useState(false);

    useEffect(() => {
        if(user && user.token) {
          currentSeller(user.token)
          .then(res => {
              console.log('CURRENT SELLER RES', res);
              setOk(true);
          })
          .catch((err) => {
              console.log("SELLER ROUTE ERR", err);
              setOk(false);
          });
        }
    }, [user]);

    return ok ? (
        <Route {...rest} render={() => children} />  
    ) : (
        <LoadingToRedirect />    
    );
};

export default SellerRoute;