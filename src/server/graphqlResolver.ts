import { MutationResolvers, QueryResolvers, Resolvers } from "./gen";
//@ts-ignore
import { neo4jgraphql } from "neo4j-graphql-js";

type Context = { idToken: { uid: string } | null };

const Query: QueryResolvers<Context> = {
  async currentUser(_parent, _args, context, _info) {
    return {
      id: context.idToken?.uid!,
    };
  },

  //@ts-ignore
  recipesNotArchived(object, params, _context, resolveInfo) {
    return neo4jgraphql(object, params, _context, resolveInfo);
  },
};


const Mutation: MutationResolvers<Context> = {
  //@ts-ignore
  async createRecipeWithIngredients(object, params, _context, resolveInfo) {
    console.log(params)
    if (_context.idToken?.uid == null) {
      throw new Error("401");
    }
    if (_context.idToken?.uid != params.userId) {
      throw new Error("wrong user!");
    }
    return neo4jgraphql(object, params, _context, resolveInfo);
  },

  async archiveRecipe(object, params, _context, resolveInfo) {
    console.log(object, params, _context, resolveInfo);
    if (_context.idToken?.uid == null) {
      throw new Error("401");
    }
    // if (_context.idToken?.uid != params.creator.id) {
      // throw new Error("wrong user!");
    // }
    return neo4jgraphql(object, params, _context, resolveInfo);
  },

  async dummy(_parent, _args, _context, _info) {
    if (_context.idToken?.uid == null) {
      throw new Error("401");
    }
    return {
      error: false,
    };
  },
};

export const resolvers: Resolvers<Context> = {
  Query,
  Mutation,
};
