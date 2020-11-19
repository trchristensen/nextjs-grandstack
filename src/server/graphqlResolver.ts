import { MutationResolvers, QueryResolvers, Resolvers } from "./gen";

import { RecipeMutations, RecipeQueries } from './resolvers/Recipes.resolvers';
import { UserMutations } from './resolvers/Users.resolvers';
import { LikesQueries, LikesMutations } from "./resolvers/Likes.resolvers";


type Context = { idToken: { uid: string } | null };


const CurrentUser: QueryResolvers<Context> = {
  //@ts-ignore
  async currentUser(_parent, _args, context, _info) {
    return {
      id: context.idToken?.uid!,
    };
  },
};

const Query = {
  ...CurrentUser,
  ...RecipeQueries,
  ...LikesQueries,
};

const Mutation = {
  ...UserMutations,
  ...RecipeMutations,
  ...LikesMutations
}


export const resolvers: Resolvers<Context> = {
  Query,
  Mutation,
  
};
