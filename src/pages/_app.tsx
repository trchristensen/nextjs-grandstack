import React from "react";
import { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import { createGraphqlClient } from "../client/createGraphqlClient";

const App = ({ Component, pageProps }: AppProps) => {
  const client = createGraphqlClient();
  return (
    <ApolloProvider client={client as any}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
};

export default App;