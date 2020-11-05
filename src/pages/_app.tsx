import React from "react";
import { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import { createGraphqlClient } from "../client/createGraphqlClient";
import theme from "../theme";
import { ThemeProvider, CSSReset } from "@chakra-ui/core";

const App = ({ Component, pageProps }: AppProps) => {
  const client = createGraphqlClient();
  return (
    <ApolloProvider client={client as any}>
      <ThemeProvider theme={theme}>
        <CSSReset />
        <Component {...pageProps} />
      </ThemeProvider>
    </ApolloProvider>
  );
};

export default App;