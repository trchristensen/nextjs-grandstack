import React from "react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
// import { useAuthState } from "react-firebase-hooks/auth";
// import { getAuth, logout } from "../client/firebaseHelpers";
// import { useArchiveRecipeMutation, Recipe, Flavor } from "../client/gen/index";

import { Box } from "@chakra-ui/core";

import { CreateRecipe } from "../client/components/CreateRecipe/CreateRecipe.component";
import { RecipeCard } from "../client/components/RecipeCard/RecipeCard.component";
import { RECIPES_QUERY } from "../client/gql/recipes";

type Props = {};

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  console.log("ctx", ctx);
  return {
    props: {},
  };
};

const GetRecipes = () => {
  const recipes = useQuery(RECIPES_QUERY, {
    variables: {
      orderBy: "published_desc",
    },
  });

  return (
    <Box>
      {recipes.loading && !recipes.error && <p>Loading...</p>}
      {recipes.error && !recipes.loading && (
        <p>Error: {JSON.stringify(recipes.error)}</p>
      )}
      {recipes.data &&
        !recipes.loading &&
        !recipes.error &&
        recipes.data.recipesNotArchived.map((recipe: any) => (
          <RecipeCard key={recipe.recipeId} {...recipe} />
        ))}
    </Box>
  );
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
