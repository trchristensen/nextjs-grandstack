import gql from "graphql-tag";

export const DELETE_RECIPE = gql`
  mutation DeleteRecipe($recipeId: ID!) {
    DeleteRecipe(recipeId: $recipeId) {
      recipeId
      name
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
        percentage
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

export const CREATE_RECIPE_MUTATION = gql`
  mutation createRecipeWithIngredientsAndTags(
    $userId: String!
    $recipeId: ID!
    $name: String!
    $description: String!
    $published: String!
    $isArchived: Boolean!
    $ingredients: [CustomIngredientsInput]
    $notes: String
    $mixingPercentage: Int
    $steepTime: Int
    $tags: [CustomTagsInput]
  ) {
    createRecipeWithIngredientsAndTags(
      userId: $userId
      recipeId: $recipeId
      name: $name
      description: $description
      published: $published
      isArchived: $isArchived
      ingredients: $ingredients
      notes: $notes
      mixingPercentage: $mixingPercentage
      steepTime: $steepTime
      tags: $tags
    ) {
      name
      recipeId
    }
  }
`;

export const UPDATE_RECIPE = gql`
  mutation UpdateRecipeWithIngredientsAndTags(
    $userId: String!
    $recipeId: ID!
    $name: String!
    $description: String!
    $published: String!
    $isArchived: Boolean!
    $ingredients: [CustomIngredientsInput]
    $notes: String
    $mixingPercentage: Int
    $steepTime: Int
    $tags: [CustomTagsInput]
  ) {
    updateRecipeWithIngredientsAndTags(
      userId: $userId
      recipeId: $recipeId
      name: $name
      description: $description
      published: $published
      isArchived: $isArchived
      ingredients: $ingredients
      notes: $notes
      mixingPercentage: $mixingPercentage
      steepTime: $steepTime
      tags: $tags
    ) {
      name
      recipeId
    }
  }
`;