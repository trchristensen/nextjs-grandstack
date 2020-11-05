import React from 'react';
// import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import {CreateRandomID} from '../../../helpers/CreateRandomId'
import { getAuth } from "../../../client/firebaseHelpers";
import { useAuthState } from "react-firebase-hooks/auth";

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
    refetchQueries: [{ query: RECIPES_NOT_ARCHIVED }],
    onCompleted: (res) => {
      console.log(res);
    },
    onError: (err) => {
      console.error(err);
    },
  });

  const RecipePayload = {
    variables: {
      userId: `${user?.uid}`,
      recipeId: CreateRandomID(32),
      name: `${name}`,
      description: `${description}`,
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

  const handleCreateRecipe = (e: any) => {
    e.preventDefault();
    console.log(user?.uid);
    CreateRecipeWithIngredients(RecipePayload);
  }

  return (
    <div>
      <form onSubmit={(e: React.FormEvent) => handleCreateRecipe(e)}>
        <input
          name="name"
          placeholder="name"
          type="text"
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setName(e.target.value)
          }
        />
        <input
          name="description"
          placeholder="description"
          type="text"
          value={description}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setDescription(e.target.value)
          }
        />
        <button type="submit">Create Recipe</button>
      </form>
    </div>
  );
}
