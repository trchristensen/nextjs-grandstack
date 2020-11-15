import React from "react";
import { GetServerSideProps } from "next";
import { Header } from "../client/components/Header";
import { Box } from "@chakra-ui/core";

import Login from "../client/components/Login/Login.component";

type Props = {};

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  console.log("ctx", ctx);
  return {
    props: {},
  };
};

const RecipesPage = () => {
  return (
    <>
      <Header />
      <Box style={{ marginTop: "40px" }}>
        <Login />
      </Box>
    </>
  );
};

export default RecipesPage;
