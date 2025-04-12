import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider as ApolloHooksProvider } from '@apollo/client';

// Create an Apollo Client instance
const client = new ApolloClient({
  uri: 'http://3.147.43.251/graphql',  // Your GraphQL server endpoint
  cache: new InMemoryCache(),  // Apollo Client will cache data for you
});

// ApolloProvider component wraps your app to provide Apollo Client to your entire component tree
const ApolloProvider = ({ children }) => {
  return (
    <ApolloHooksProvider client={client}>
      {children}
    </ApolloHooksProvider>
  );
};

export default ApolloProvider;
