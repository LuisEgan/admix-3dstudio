import React from 'react';
import App, { Container } from 'next/app';
import { Provider } from 'react-redux';
import { ApolloProvider } from 'react-apollo';
import { PersistGate } from 'redux-persist/integration/react';
import withApolloClient from '../lib/withApollo';
import withRedux from '../lib/withRedux';

import '../scss/index.scss';
import 'react-step-progress-bar/styles.css';

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};

    return { pageProps };
  }

  render() {
    const { Component, pageProps, reduxStore, apolloClient } = this.props;

    return (
      <Container>
        <Provider store={reduxStore}>
          <PersistGate persistor={reduxStore.__persistor}>
            <ApolloProvider client={apolloClient}>
              <Component apolloClient={apolloClient} {...pageProps} />
            </ApolloProvider>
          </PersistGate>
        </Provider>
      </Container>
    );
  }
}

export default withApolloClient(withRedux(MyApp));
