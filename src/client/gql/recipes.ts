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
      likes {
        userId
      }
      dislikes {
        userId
      }
      numLikes
      numDislikes
      # numComments
    }
  }
`;

export const UPDATE_RECIPE_RATING = gql`
  mutation updateRecipeRating(
    $userId: String!
    $recipeId: String!
    $ratingId: ID!
    $like: Boolean!
    $timestamp: String!
  ) {
    updateRecipeRating(
      userId: $userId
      recipeId: $recipeId
      ratingId: $ratingId
      timestamp: $timestamp
      like: $like
    ) {
      userId
    }
  }
`;