//@ts-ignore
import { neo4jgraphql } from "neo4j-graphql-js";
// import { MutationResolvers, QueryResolvers, Resolvers } from "../gen";

type Context = { idToken: { uid: string } | null };


export const FlavorQueries: any = {
  //@ts-ignore
  flavorQuery(object, params, _context, resolveInfo) {
    return neo4jgraphql(object, params, _context, resolveInfo);
  },
};
