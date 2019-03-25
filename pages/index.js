import React, { useState, useEffect } from 'react';
import Router from 'next/router';

const Index = props => {
  useEffect(() => {
    Router.push('/login');
  });

  const signout = apolloClient => () => {
    document.cookie = cookie.serialize('token', '', {
      maxAge: -1,
    });
    apolloClient.cache.reset().then(() => {
      redirect({}, '/signin');
    });
  };

  return null;
};

export default Index;
