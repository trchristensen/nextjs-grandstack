import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import { Box, Button, Spinner } from "@chakra-ui/core";
import { RecipeCard } from "../RecipeCard/RecipeCard.component";
import { RECIPES_QUERY } from "../../gql/recipes";
//@ts-ignore
import InfiniteScroll from "react-infinite-scroller";

export const GetRecipes = ({
  isArchived = false,
  orderBy = "published_desc",
  first = 5,
  offset = 0,
  ...filter
}) => {

  const [hasMore, setHasMore] = React.useState(true);

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

  const handleFetchMore = () => {
    recipes.fetchMore({
      variables: {
        offset: recipes.data.Recipe.length,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        //@ts-ignore
        if (fetchMoreResult.length < first) return setHasMore(false)
        setHasMore(false)
        //@ts-ignore
        
        return Object.assign({}, prev, {
          //@ts-ignore
          Recipe: [...prev.Recipe, ...fetchMoreResult.Recipe],
        });
      },
    });
  };

  return (
    <Box>
      {recipes.loading && !recipes.error && (
        <Box w="full" textAlign="center" className="loader" key={0}>
          <Spinner />
        </Box>
      )}
      {recipes.error && !recipes.loading && (
        <p>Error: {JSON.stringify(recipes.error)}</p>
      )}

      {
        recipes.data && recipes.data.Recipe.length == 0 && !recipes.loading && !recipes.error && (
          <Box>No Recipes!</Box>
        )
      }

      {recipes.data && !recipes.loading && !recipes.error && (
        <InfiniteScroll
          pageStart={0}
          loadMore={handleFetchMore}
          hasMore={hasMore}
          loader={
            <Box w="full" textAlign="center" className="loader" key={0}>
              <Spinner />
            </Box>
          }
        >
          {recipes.data.Recipe.map((recipe: any) => (
            <RecipeCard key={recipe.recipeId} {...recipe} />
          ))}
        </InfiniteScroll>
      )}
    </Box>
  );
};
