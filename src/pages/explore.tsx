import React from "react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { Box, Button, Input, Stack, Tag } from "@chakra-ui/core";
import { CreateRecipe } from "../client/components/CreateRecipe/CreateRecipe.component";
import { GetRecipes } from '../client/components/GetRecipes/GetRecipes.component'

// import { useAuthState } from "react-firebase-hooks/auth";
// import { getAuth, logout } from "../client/firebaseHelpers";
// import { useArchiveRecipeMutation, Recipe, Flavor } from "../client/gen/index";

import gql from "graphql-tag";
import { useLazyQuery, useQuery } from "@apollo/react-hooks";
import { CreateRandomID } from "../helpers/CreateRandomId";
import { useRouter } from "next/router";

const TagList = () => {

  const TAGS = gql`
    query {
      Tag(orderBy: numRecipes_desc, first: 20) {
        numRecipes
        name
      }
    }
  `;

  const tags = useQuery(TAGS);

  return (
    <Box mt={4} bg="white" rounded="md" p={4} pt={2} shadow="md">
      <Stack spacing={2} direction="row" flexWrap="wrap">
      {tags.data && !tags.error && (

        
          tags.data.Tag.map((tag: any) => {
            return (
              <Tag
                _hover={{ shadow: "sm" }}
                key={tag.tagId + CreateRandomID(6)}
                mt={2}
                size="lg"
              >
                <Link href={`/explore?tag=${tag?.name}`}>
                  <a>{tag?.name}</a>
                </Link>
              </Tag>
            );
          })
      )}
      </Stack>
    </Box>
  );
}



const RecipeSearch = () => {
const router = useRouter();

  const RECIPE_SEARCH = gql`
    query FuzzyRecipeSearch($searchString: String!){
      fuzzyRecipeByName(searchString: $searchString) {
        id
        name
      }
    }
  `;

  const [getSearch, { loading, error, data }] = useLazyQuery(RECIPE_SEARCH);
  const [searchString, setSearchString] = React.useState('')

  const handleSearch = (event:any) => {
    event.preventDefault()
    router.push(`/explore?q=${searchString}`);
    setSearchString('');
    getSearch({
      variables: {
        searchString: searchString
      }
    })
  }

  return (
    <Box mt={4}>
      <Box shadow="md" bg="white" p={4}>
        <form onSubmit={handleSearch}>
          <Input
            value={searchString}
            onChange={(event: any) => setSearchString(event.target.value)}
            type="search"
            placeholder="Search Recipes"
          />
          <Button w="full" mt={2} type="submit">Search</Button>
        </form>
      </Box>

      <Box>
        {loading && <p>Loading ...</p>}
        {data && !error && JSON.stringify(data.fuzzyRecipeByName)}
      </Box>
    </Box>
  );
}


const RecipesPage = () => {
  return (
    <Box>
      <Box maxW="500px">
        <Box mb={4}>
          <CreateRecipe />
          <Box id="pop_tags">
           <TagList />
           <RecipeSearch />
          </Box>
        </Box>
        <GetRecipes />
      </Box>
    </Box>
  );
};

export default RecipesPage;
