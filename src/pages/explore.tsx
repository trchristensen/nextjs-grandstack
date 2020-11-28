import React from "react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { Box } from "@chakra-ui/core";
import { CreateRecipe } from "../client/components/CreateRecipe/CreateRecipe.component";
import { GetRecipes } from '../client/components/GetRecipes/GetRecipes.component'

// import { useAuthState } from "react-firebase-hooks/auth";
// import { getAuth, logout } from "../client/firebaseHelpers";
// import { useArchiveRecipeMutation, Recipe, Flavor } from "../client/gen/index";

type Props = {};

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  console.log("ctx", ctx);
  return {
    props: {},
  };
};



const RecipesPage = () => {
  return (
    <Box>
      <Box maxW="500px">
        <Box mb={4}>
          <CreateRecipe />
        </Box>
        <GetRecipes />
      </Box>
    </Box>
  );
};

export default RecipesPage;
