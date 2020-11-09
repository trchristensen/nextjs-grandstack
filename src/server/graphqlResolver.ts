import { Resolvers } from "./gen";

import { RecipeMutations, RecipeQueries } from './resolvers/Recipes.resolvers';
import { UserMutations } from './resolvers/Users.resolvers';


type Context = { idToken: { uid: string } | null };


const Query = {
  ...RecipeQueries,
};

const Mutation = {
  ...UserMutations,
  ...RecipeMutations
}


export const resolvers: Resolvers<Context> = {
  Query,
  Mutation,
  
};
