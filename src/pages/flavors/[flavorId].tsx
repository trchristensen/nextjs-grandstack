import { useRouter } from "next/router";
import { useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "../../client/firebaseHelpers";

import { Avatar, Box, Text, Button } from "@chakra-ui/core";
import { RecipeCard } from "../../client/components/RecipeCard/RecipeCard.component";
import { USER_RECIPES } from "../../client/gql/recipes";
import { FLAVOR_QUERY } from "../../client/gql/flavors";



const FlavorData = () => {
  const router = useRouter();
  const flavorId = router.query.flavorId;

  const flavor = useQuery(FLAVOR_QUERY, {
    variables: {
      flavorId: flavorId,
    },
    onCompleted: (res) => {
      console.log(res);
    },
    onError: (err) => {
      console.error(err);
    },
  });

  return (
    <Box>
      {JSON.stringify(flavor.data)}
    </Box>
  );
};

const FlavorPage = () => {
  return (
    <Box w="500px" maxW="100%">
      <>
        <Box
          display="flex"
          w="100%"
          flexDir="column"
          bg="white"
          rounded="lg"
          shadow="md"
          p={4}
        >
          <Box w="500px" maxW="100%" mt={4}>
            <FlavorData />
          </Box>
        </Box>
      </>
    </Box>
  );
};

export default FlavorPage;
