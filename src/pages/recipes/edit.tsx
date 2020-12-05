import React from 'react';
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "../../client/firebaseHelpers";

import { Avatar, Box, Text, Button, Icon } from "@chakra-ui/core";
import BackBar from "../../client/components/BackBar/BackBar.component";
import EditRecipe from '../../client/components/EditRecipe/EditRecipe.component'

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
      <EditRecipe />
    </Box>
  );
};

export default RecipePage;
