import { GetServerSideProps } from "next";
import { useAuthState } from "react-firebase-hooks/auth";
import { loginWithGithub, getAuth, logout } from "../client/firebaseHelpers";
import { Header } from "../client/components/Header";
import {
  useCurrentUserQuery,
  useDummyMutation,
  useCreateRecipeWithIngredientsMutation,
} from "../client/gen/index";
import { GraphQLBoolean } from "graphql";

// import { gql, useMutation } from '@apollo/client';
import { useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import React from "react";

type Props = {};

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  return {
    props: {},
  };
};

const Index = () => {
  const [user, loading] = useAuthState(getAuth());
  // console.log('user:', user);
  return (
    <main>
      <Header />
      {!loading && user ? (
        <>
          <button onClick={() => logout()}>Logout</button>
          <GraphqlExample />
        </>
      ) : (
        <button onClick={() => loginWithGithub()}>Login</button>
      )}
      <CreateRecipe />
      <GetRecipes />
    </main>
  );
};

const GET_RECIPES = gql`
  query {
    Recipe {
      recipeId
      name
    }
  }
`;

 type CustomIngredientsInput = {
   amount: number;
   measurement: string;
   flavorId: string;
 }

const CREATE_RECIPE_WITH_INGREDIENTS = gql`
  mutation createRecipeWithIngredients(
    $userId: String!
    $recipeId: ID!
    $name: String!
    $description: String!
    $published: String!
    $isArchived: Boolean!
    $ingredients: [CustomIngredientsInput]
  ) {
    createRecipeWithIngredients(
      userId: $userId
      recipeId: $recipeId
      name: $name
      description: $description
      published: $published
      isArchived: $isArchived
      ingredients: $ingredients
    ) {
      name
      recipeId
    }
  }
`;

function CreateRecipe() {
  const [CreateRecipeWithIngredients] = useMutation(
    CREATE_RECIPE_WITH_INGREDIENTS,
    {
      onCompleted: (res) => {
        console.log(res);
      },
      onError: (err) => {
        console.error(err);
      },
    }
  );

  const RecipePayload = {
    variables: {
      userId: "google-oauth2|109167584921949758779",
      recipeId: "111123-recipe-id-123weewe",
      name: "123ABCDEFG",
      description: "Recipe description",
      published: "2020-09-22T16:17:31.419Z",
      isArchived: false,
      ingredients: [
        {
          amount: 10,
          measurement: "%",
          flavorId: "4c09d545-9e25-42fa-8173-fa7f6529611d",
        },
      ],
    },
  };



  return (
    <div>
      <button
        onClick={() => {
          CreateRecipeWithIngredients(RecipePayload);
        }}
      >
        Create Recipe
      </button>
    </div>
  );
}

function GetRecipes() {
  const { loading, data, error } = useQuery(GET_RECIPES);

  return (
    <div style={{ marginTop: "30px" }}>
      {loading && !error && <p>Loading...</p>}
      {error && !loading && <p>Error: {JSON.stringify(error)}</p>}
      {data &&
        !loading &&
        !error &&
        data.Recipe.map((recipe: any) => <li>{recipe.name}</li>)}
    </div>
  );
}

function GraphqlExample() {
  const currentUserQuery = useCurrentUserQuery();
  const [dummy, result] = useDummyMutation();
  return (
    <div>
      <div>uid: {currentUserQuery.data?.currentUser?.id}</div>
      <button
        disabled={result.loading}
        onClick={async () => {
          const res = await dummy({ variables: {} });
          alert(res.data?.dummy?.error);
        }}
      >
        run command
      </button>
    </div>
  );
}

export default Index;
