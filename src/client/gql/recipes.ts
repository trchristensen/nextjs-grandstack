import gql from "graphql-tag";

export const ARCHIVE_RECIPE = gql`
  mutation archiveRecipe($recipeId: ID!, $userId: ID!) {
    archiveRecipe(recipeId: $recipeId, userId: $userId) {
      recipeId
      name
      isArchived
      creator {
        id
        name
      }
    }
  }
`;

export const RECIPES_NOT_ARCHIVED = gql`
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
        name
        avatar
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
      numComments
    }
  }
`;

export const ADD_RECIPE_LIKE = gql`
  mutation addRecipeLike(
    $userId: String!
    $recipeId: String!
    $likeId: ID!
    $timestamp: String!
  ) {
    addRecipeLike(
      userId: $userId
      recipeId: $recipeId
      likeId: $likeId
      timestamp: $timestamp
    ) {
      userId
    }
  }
`;

export const REMOVE_RECIPE_LIKE = gql`
  mutation removeRecipeLike(
    $userId: String!
    $recipeId: String!
    $likeId: ID!
    $timestamp: String!
  ) {
    removeRecipeLike(
      userId: $userId
      recipeId: $recipeId
      likeId: $likeId
      timestamp: $timestamp
    ) {
      userId
    }
  }
`;
