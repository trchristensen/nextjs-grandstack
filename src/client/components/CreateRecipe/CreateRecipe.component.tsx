import React from 'react';
// import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import {CreateRandomID} from '../../../helpers/CreateRandomId'
import { getAuth } from "../../../client/firebaseHelpers";
import { useAuthState } from "react-firebase-hooks/auth";

import { Input, Button, Box } from "@chakra-ui/core";

import {
  useCreateRecipeWithIngredientsMutation
} from "../../gen/index";


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

export function CreateRecipe() {
  const [user,] = useAuthState(getAuth());
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState("");

  const [CreateRecipeWithIngredients] = useCreateRecipeWithIngredientsMutation({
    refetchQueries: [
    {
      query: RECIPES_NOT_ARCHIVED,
      variables: {
        orderBy: "published_asc",
      }}
    ],
    onCompleted: (res) => {
      console.log(res);
      setName('');
      setDescription('')
    },
    onError: (err) => {
      console.error(err);
    },
  });



  const handleCreateRecipe = (e: any) => {
    e.preventDefault();
    const currentDateTime = new Date().toISOString();

    const RecipePayload = {
      variables: {
        userId: `${user?.uid}`,
        recipeId: CreateRandomID(32),
        name: `${name}`,
        description: `${description}`,
        published: currentDateTime,
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

    console.log(user?.uid);
    CreateRecipeWithIngredients(RecipePayload);
  }

    

  return (
    <Box w="500px" maxW="100%" marginX="auto" marginY="1em">
      <form onSubmit={(e: React.FormEvent) => handleCreateRecipe(e)}>
        <Input
          name="name"
          placeholder="name"
          type="text"
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setName(e.target.value)
          }
        />
        <Input
          marginTop="1em"
          name="description"
          placeholder="description"
          type="text"
          value={description}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setDescription(e.target.value)
          }
        />
        <Button type="submit" variantColor="blue" marginTop="1em">Create Recipe</Button>
      </form>
    </Box>
  );
}
