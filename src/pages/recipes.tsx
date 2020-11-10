import React from 'react'
import { GetServerSideProps } from "next";
import { useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Header } from "../client/components/Header";

import { CreateRecipe } from '../client/components/CreateRecipe/CreateRecipe.component'
import { useArchiveRecipeMutation, Recipe, Flavor} from '../client/gen/index'

import { Avatar, Box, Text, Button, Stack, Tooltip } from '@chakra-ui/core';
import { formatDistanceToNow } from "date-fns";


type Props = {};

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  console.log('ctx', ctx)
  return {
    props: {},
  };
};


const RECIPES_NOT_ARCHIVED = gql`
  query recipesNotArchived(
    $first: Int
    $offset: Int
    $orderBy: [_RecipeOrdering]
  ) {
    recipesNotArchived(first: $first, offset: $offset, orderBy: $orderBy) {
      recipeId
      name
      description
      published
      lastEdited
      creator {
        id
        displayName
      }
      parent {
        recipeId
        name
      }
      ingredients {
        amount
        measurement
        Flavor {
          flavorId
          name
        }
      }
      tags {
        name
        tagId
      }
    }
  }
`;

export const archiveRecipe = gql`
  mutation archiveRecipe($recipeId: ID!, $userId: ID!) {
    archiveRecipe(recipeId: $recipeId, userId: $userId) {
      recipeId
      name
      isArchived
      creator {
        id
        displayName
      }
    }
  }
`;



function RecipeCard(recipe: Recipe) {

const [archive] = useMutation(archiveRecipe, {
  refetchQueries: [
    {
      query: RECIPES_NOT_ARCHIVED,
      variables: {
        orderBy: "published_desc",
      },
    },
  ],
  variables: {
    userId: recipe.creator?.id,
    recipeId: recipe.recipeId,
  },
  onCompleted: (res) => {
    console.log(res);
  },
  onError: (err) => {
    console.error(err);
  },
});


  return (
    <Box
      className="recipeCard"
      marginBottom={4}
      p={4}
      shadow="md"
      rounded="lg"
      display="block"
      bg="white"
      width="full"
    >
      <Box
        className="recipeCard__header"
        display="flex"
        flexDirection="row"
        alignItems="items-start"
        justifyContent="space-between"
      >
        <Box width="full" display="flex" flexDirection="row">
          <Avatar bg="gray.500" size="sm" name="author name" mt={1} src=""></Avatar>
          <Box
            className="recipeCard__header-info"
            display="flex"
            flexDirection="column"
            width="100%"
            px={2}
          >
            <Text as="span" fontSize="lg" lineHeight="shorter" fontWeight="bold" px={0}>
              {recipe.name}
            </Text>
            <Box
              className="recipeCard__header-info-details"
              display="flex"
              flexWrap="wrap"
              flexDirection="row"
              alignItems="flex-end"
              fontSize="sm"
            >
              <Text color="text-gray-60" as="span" lineHeight="shorter" display="flex">
                {recipe.creator?.displayName}
                <Text mx={1}>{" • "} </Text>
                {formatDistanceToNow(
                  //@ts-ignore
                  new Date(recipe.published)
                )}{" "}
                {recipe.isArchived && ` - Archived`}
              </Text>
            </Box>
          </Box>
          <Button
            variantColor="gray"
            variant="ghost"
            rounded="full"
            shadow="none"
            size="sm"
            style={{ display: "block", cursor: "pointer" }}
            onClick={() => archive()}
          >
            X
          </Button>
        </Box>
      </Box>
      <Box className="recipeCard__content">
        <Box mt={2} mb={3}>
          <Text>{recipe.description}</Text>
          {/* <Box>[Flavor details here]</Box> */}
        </Box>
        <Box>
          <Stack
            className="w-full border rounded-lg overflow-hidden ingredientsBar"
            bg={"gray.200"}
            overflow="hidden"
            borderRadius="lg"
            border={1}
            w="full"
            spacing={0}
            isInline
          >
            {recipe.ingredients &&
              recipe.ingredients?.map((ingredient: any) => {
               
                return (
                  <Box
                    style={{ width: `${ingredient.amount}%` }}
                    // key={ingredient.Flavor.flavorId}
                    className="ingredientsBar__ingredient text-gray-700 font-semibold text-xs flex justify-center items-center flex-row border-r border-gray-200"
                  >
                    <Tooltip
                      aria-label="tooltip"
                      label={`${ingredient.Flavor.name} - ${ingredient.amount}
                      ${ingredient.measurement}`}
                      placement="bottom"
                    >
                      <div
                        className="w-full text-center relative block"
                        style={{ height: "10px" }}
                      ></div>
                    </Tooltip>
                  </Box>
                );
              })}
          </Stack>
        </Box>
        <Box className="recipe__tags">
          {recipe.tags?.map((tag) => {
            return <li>{tag?.name}</li>;
          })}
        </Box>
      </Box>
    </Box>
  );
}


const GetRecipes = () => {
  const { loading, data, error } = useQuery(RECIPES_NOT_ARCHIVED, {
    notifyOnNetworkStatusChange: true,
    variables: {
      orderBy: "published_desc",
    },
  });


  return (
    <main>
      <div style={{ marginTop: "30px", maxWidth: "700px", display: "block", width: '100%', marginLeft: 'auto', marginRight: 'auto'  }}>
        {loading && !error && <p>Loading...</p>}
        {error && !loading && <p>Error: {JSON.stringify(error)}</p>}
        {data &&
          !loading &&
          !error &&
          data.recipesNotArchived.map((recipe: any) => (
            <RecipeCard key={recipe.recipeId} {...recipe} />
          ))}
      </div>
    </main>
  );
}




const RecipesPage = () => {
  return (
    <>
      <Header />
      <div style={{marginTop: '40px'}}><hr /><CreateRecipe /><hr /></div>
      <GetRecipes />
    </>
  );
}


export default RecipesPage;