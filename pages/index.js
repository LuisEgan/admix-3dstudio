import React, { useState, useEffect } from "react";
import Router from "next/router";

let Index = props => {
  useEffect(() => {
    Router.push("/login");
  });

  signout = apolloClient => () => {
    document.cookie = cookie.serialize("token", "", { maxAge: -1 });
    apolloClient.cache.reset().then(() => {
      redirect({}, "/signin");
    });
  };

  return null;
};

export default Index;
