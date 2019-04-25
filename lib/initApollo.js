import { ApolloClient, InMemoryCache } from 'apollo-boost';
import { createUploadLink } from 'apollo-upload-client';
import { setContext } from 'apollo-link-context';
import fetch from 'isomorphic-unfetch';

const PORT = parseInt(process.env.PORT, 10) || 4000;
const HOST = process.env.HOST || 'http://localhost';

let apolloClient = null;
const ssrMode = !process.browser;

if (ssrMode) {
  global.fetch = fetch;
}

function create(initialState, { getToken }) {
  const httpLink = createUploadLink({
    uri: `${HOST}:${PORT}/graphql`,
    credentials: 'same-origin',
  });

  const authLink = setContext((_, { headers }) => {
    const token = getToken();
    return {
      headers: {
        ...headers,
        authorization: token || '',
      },
    };
  });

  return new ApolloClient({
    connectToDevTools: !ssrMode,
    ssrMode,
    link: authLink.concat(httpLink),
    cache: new InMemoryCache().restore(initialState || {}),
  });
}

export default function initApollo(initialState, options) {
  if (ssrMode) {
    return create(initialState, options);
  }

  if (!apolloClient) {
    apolloClient = create(initialState, options);
  }

  return apolloClient;
}
