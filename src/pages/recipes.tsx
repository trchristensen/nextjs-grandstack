import React from 'react'
import { GetServerSideProps } from "next";
import { useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Header } from "../client/components/Header";
import { loginWithGithub, getAuth, logout } from "../client/firebaseHelpers";
import { useAuthState } from "react-firebase-hooks/auth";

import { CreateRecipe } from '../client/components/CreateRecipe/CreateRecipe.component'
import { useArchiveRecipeMutation, Recipe } from '../client/gen/index'

import { Avatar, Box, Text, Button } from '@chakra-ui/core';
import { formatDistanceToNow } from "date-fns";


type Props = {};

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
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
        orderBy: "published_asc",
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
        <Box>
          <Avatar bg="gray.500" size="sm" name="author name" src=""></Avatar>
        </Box>
      </Box>
      <span>{recipe.name}</span>
      <br />
      <span>{recipe.description}</span>
      <Button
        variantColor="pink"
        shadow="none"
        variant="solid"
        size="sm"
        style={{ display: "block", cursor: "pointer" }}
        onClick={() => archive()}
      >
        Delete
      </Button>
      {formatDistanceToNow(
        //@ts-ignore
        new Date(recipe.published)
      )}
    </Box>
  );
}


const GetRecipes = () => {
  const { loading, data, error } = useQuery(
    RECIPES_NOT_ARCHIVED,
    {
      notifyOnNetworkStatusChange: true,
      variables: {
        orderBy: "published_asc",
      },
    }
  );


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