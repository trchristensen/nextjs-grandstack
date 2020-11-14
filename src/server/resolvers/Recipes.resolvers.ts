//@ts-ignore
import { neo4jgraphql } from "neo4j-graphql-js";
import { MutationResolvers, QueryResolvers, Resolvers } from "../gen";

type Context = { idToken: { uid: string } | null };


export const RecipeQueries: QueryResolvers<Context> = {

  //@ts-ignore
  recipesNotArchived(object, params, _context, resolveInfo) {
    return neo4jgraphql(object, params, _context, resolveInfo);
  },
};


export const RecipeMutations: MutationResolvers<Context> = {
  //@ts-ignore
  async createRecipeWithIngredients(object, params, _context, resolveInfo) {
    console.log(params);

    // validation
    if (params.name.length < 3) {
      throw new Error("please make the name at least 3 characters long");
    }
    if (params.description.length < 3) {
      throw new Error("please make the description at least 3 characters long");
    }

    params.ingredients?.map(ingredient => {
      if(ingredient?.measurement != 'g' && ingredient?.measurement != '%' && ingredient?.measurement != 'drops') {
        throw new Error('invalid input for ingredient')
      }
      if(ingredient?.amount == null || isNaN(ingredient?.amount)) {
        throw new Error('invalid ingredient amount');
      }
    })

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
    if (_context.idToken?.uid != params.userId) {
      throw new Error("wrong user!");
    }
    return neo4jgraphql(object, params, _context, resolveInfo);
  },
};
