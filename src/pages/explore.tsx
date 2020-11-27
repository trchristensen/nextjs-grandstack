import React from "react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/react-hooks";
import { Box } from "@chakra-ui/core";
import { CreateRecipe } from "../client/components/CreateRecipe/CreateRecipe.component";
import { RecipeCard } from "../client/components/RecipeCard/RecipeCard.component";
import { RECIPES_QUERY } from '../client/gql/recipes'
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

const GetRecipes = () => {

    const router = useRouter();
    const query = router.query.q;

    let filter;
    if (query) {
      filter = {
        tags_single: {name_contains: query}
      }
    }
    
    const recipes = useQuery(RECIPES_QUERY, {
      variables: {
        isArchived: false,
        orderBy: "published_desc",
        filter: filter
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
        recipes.data.Recipe.map((recipe: any) => (
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
