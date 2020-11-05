import React from 'react'
import { GetServerSideProps } from "next";
import { useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Header } from "../client/components/Header";
import { loginWithGithub, getAuth, logout } from "../client/firebaseHelpers";
import { useAuthState } from "react-firebase-hooks/auth";

import { CreateRecipe } from '../client/components/CreateRecipe/CreateRecipe.component'
import { useArchiveRecipeMutation, Recipe } from '../client/gen/index'


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



function RecipeCard(recipe: Recipe, refetch:any) {

const [archive,] = useMutation(archiveRecipe, {
    // refetchQueries: [{ query: RECIPES_NOT_ARCHIVED }],
    variables: {
      orderBy: "published_asc",
      userId: recipe.creator?.id,
      recipeId: recipe.recipeId,
    },
    onCompleted: (res) => {
      console.log(res);
      () => refetch;
    },
    onError: (err) => {
      console.error(err);
    },
});


  return (
    <div style={{ display: "block", marginBottom: "1em" }}>
      <span>{recipe.name}</span>
      <br />
      <span>{recipe.description}</span>
      <button style={{display:'block'}} onClick={() => archive()}>Delete</button>
    </div>
  );
}


const GetRecipes = () => {
  const { loading, data, error, refetch, networkStatus } = useQuery(
    RECIPES_NOT_ARCHIVED,
    {
      notifyOnNetworkStatusChange: true,
      variables: {
        orderBy: "published_asc",
      },
    }
  );

  console.log(networkStatus)

  return (
    <main>
      <div style={{ marginTop: "30px" }}>
        {loading && !error && <p>Loading...</p>}
        {error && !loading && <p>Error: {JSON.stringify(error)}</p>}
        {data &&
          !loading &&
          !error &&
          data.recipesNotArchived.map((recipe: any) => (
            <RecipeCard key={recipe.recipeId} refetch={refetch} {...recipe} />
          ))}
      </div>
      <button onClick={() => refetch()}>Refresh</button>
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