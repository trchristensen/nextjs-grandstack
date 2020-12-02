import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/react-hooks";
import { Box } from "@chakra-ui/core";
import { RecipeCard } from "../RecipeCard/RecipeCard.component";
import { RECIPES_QUERY } from "../../gql/recipes";

export const GetRecipes = ({
  isArchived = false,
  orderBy = "published_desc",
  first = 20,
  offset = 0,
  ...filter
}) => {
  const router = useRouter();
  const tag = router.query.tag;
  const q = router.query.q;

  if (tag) {
    filter = {
      ...filter,
      tags_single: { name_contains: tag },
    };
  }
  if (q) {
    filter = {
      ...filter,
      name_contains: q,
    };
  }

  const recipes = useQuery(RECIPES_QUERY, {
    variables: {
      isArchived: isArchived,
      orderBy: orderBy,
      first: first,
      offset: offset,
      filter: filter,
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
