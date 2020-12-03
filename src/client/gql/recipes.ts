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

export const RECIPES_QUERY = gql`
  query recipes(
    $first: Int
    $offset: Int
    $orderBy: [_RecipeOrdering]
    $isArchived: Boolean
    $filter: _RecipeFilter
  ) {
    Recipe(
      first: $first
      offset: $offset
      orderBy: $orderBy
      isArchived: $isArchived
      filter: $filter
    ) {
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
      mixingPercentage
      steepTime
      ingredients {
        drops
        percentage
        ml
        grams
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
        ratingId
        userId
        like
      }
      dislikes {
        ratingId
        userId
        like
      }
      numLikes
      numDislikes
      numComments
      comments(orderBy: published_asc) {
        commentId
        published
        text
        author {
          userId
          name
          avatar
        }
      }
    }
  }
`;

export const RECIPE_COMMENTS = gql`
  query Recipe(
    $recipeId: ID!
    $first: Int
    $offset: Int
    $orderBy: [_RecipeOrdering]
    $isArchived: Boolean
    $filter: _RecipeFilter
  ) {
    Recipe(
      recipeId: $recipeId
      first: $first
      offset: $offset
      orderBy: $orderBy
      isArchived: $isArchived
      filter: $filter
    ) {
      comments(orderBy: published_asc) {
        commentId
        published
        text
        author {
          userId
          name
          avatar
        }
      }
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
      ratingId
      userId
      like
    }
  }
`;

export const USER_RECIPES = gql`
  query userRecipes($userId: ID!) {
    userRecipes(userId: $userId) {
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
    }
  }
`;

export const CREATE_RECIPE_COMMENT = gql`
  mutation createCommentForRecipe(
    $commentId: String!
    $recipeId: String!
    $userId: String!
    $text: String!
    $published: String!
  ) {
    createCommentForRecipe(
      commentId: $commentId
      recipeId: $recipeId
      userId: $userId
      text: $text
      published: $published
    ) {
      commentId
    }
  }
`;
