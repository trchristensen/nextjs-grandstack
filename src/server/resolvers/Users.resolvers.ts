//@ts-ignore
import { neo4jgraphql } from "neo4j-graphql-js";
import { MutationResolvers, QueryResolvers, Resolvers } from "../gen";

type Context = { idToken: { uid: string } | null };


export const UserQueries: QueryResolvers<Context> = {
  //@ts-ignore
  // CheckUser(object, params, _context, resolveInfo) {
  //   return neo4jgraphql(object, params, _context, resolveInfo);
  // },
};

export const UserMutations: MutationResolvers<Context> = {

  //@ts-ignore
  async CreateUser(object, params, _context, resolveInfo) {
    console.log(params);
    // if (_context.idToken?.uid == null) {
    //   throw new Error("401");
    // }
    return neo4jgraphql(object, params, _context, resolveInfo);
  },
};