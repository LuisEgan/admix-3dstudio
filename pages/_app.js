import React from "react";
import App, { Container } from "next/app";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import withApollo from "../lib/withApollo";
import withRedux from "../lib/withRedux";

import "../scss/index.scss";

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    const pageProps = Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : {};

    return { pageProps };
  }

  render() {
    const { Component, pageProps, reduxStore } = this.props;

    return (
      <Container>
        <Provider store={reduxStore}>
          <PersistGate persistor={reduxStore.__persistor}>
            <Component {...pageProps} />
          </PersistGate>
        </Provider>
      </Container>
    );
  }
}

MyApp = withRedux(MyApp);
MyApp = withApollo(MyApp);

export default MyApp;
