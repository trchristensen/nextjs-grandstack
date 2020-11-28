//@ts-ignore
import { neo4jgraphql } from "neo4j-graphql-js";
// import { MutationResolvers, QueryResolvers, Resolvers } from "../gen";

type Context = { idToken: { uid: string } | null };

export const LikesQueries: any = {

};

export const LikesMutations: any = {
  //@ts-ignore
  async updateRecipeRating(object, params, _context, resolveInfo) {
    console.log(object, params, _context, resolveInfo);
    if (_context.idToken?.uid == null) {
      throw new Error("401");
    }
    if (_context.idToken?.uid != params.userId) {
      throw new Error("wrong user!");
    }
    return neo4jgraphql(object, params, _context, resolveInfo);
  },
};
