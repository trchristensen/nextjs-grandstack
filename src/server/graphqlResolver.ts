import { MutationResolvers, QueryResolvers, Resolvers } from "./gen";

import { RecipeMutations, RecipeQueries } from './resolvers/Recipes.resolvers';
import { UserMutations } from './resolvers/Users.resolvers';
import { LikesQueries, LikesMutations } from "./resolvers/Likes.resolvers";
// import { FlavorQueries } from './resolvers/Flavors.resolvers';
import { neo4jgraphql } from "neo4j-graphql-js";

type Context = { idToken: { uid: string } | null };


const CurrentUser: QueryResolvers<Context> = {
  //@ts-ignore
  async currentUser(_parent, _args, context, _info) {
    return {
      id: context.idToken?.uid!,
    };
  },
};

// export const FlavorQueries: QueryResolvers<Context> = {
//   //@ts-ignore
//   flavorQuery(object, params, _context, resolveInfo) {
//     return neo4jgraphql(object, params, _context, resolveInfo);
//   },
// };


const Query = {
  ...CurrentUser,
  ...RecipeQueries,
  ...LikesQueries,
  // ...FlavorQueries,
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
