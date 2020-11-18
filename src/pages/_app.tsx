import React from "react";
import { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import { createGraphqlClient } from "../client/createGraphqlClient";
import theme from "../theme";
import "../styles.css";
import { ThemeProvider, CSSReset } from "@chakra-ui/core";
import MainLayout from "../client/layouts/main";

const App = ({ Component, pageProps }: AppProps) => {
  const client = createGraphqlClient();
  return (
    <ApolloProvider client={client as any}>
      <ThemeProvider theme={theme}>
        <CSSReset />
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      </ThemeProvider>
    </ApolloProvider>
  );
};

export default App;