// import { MutationResolvers, QueryResolvers, Resolvers } from "./gen/index";

import { RecipeMutations, RecipeQueries } from './resolvers/Recipes.resolvers';
import { UserMutations } from './resolvers/Users.resolvers';
import { LikesQueries, LikesMutations } from "./resolvers/Likes.resolvers";
type Context = { idToken: { uid: string } | null };


const CurrentUser: any = {
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


export const resolvers: any = {
  Query,
  Mutation,
  
};
