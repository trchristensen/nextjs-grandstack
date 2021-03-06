import { useRouter } from "next/router";
import { useQuery } from "@apollo/react-hooks";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "../../client/firebaseHelpers";

import { Avatar, Box, Text, Button, Icon } from "@chakra-ui/core";
import { GetRecipes } from "../../client/components/GetRecipes/GetRecipes.component";
import BackBar from '../../client/components/BackBar/BackBar.component'


const RecipePage = () => {
  const router = useRouter();
  const recipeId = router.query.recipeId;

  const [userAuth, userAuthLoading] = useAuthState(getAuth());
  let filter = {
    recipeId: recipeId,
  };

  return (
    <Box w="500px" maxW="100%" mt={4}>
      <BackBar title="Recipe" />
      <GetRecipes {...filter}  />
    </Box>
  );
};

export default RecipePage;
