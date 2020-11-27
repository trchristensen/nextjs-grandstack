import { useRouter } from "next/router";
import { useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "../../client/firebaseHelpers";

import {
  Avatar,
  Box,
  Text,
  Button
} from "@chakra-ui/core";
import { RecipeCard } from "../../client/components/RecipeCard/RecipeCard.component"
import { USER_RECIPES } from '../../client/gql/recipes'

const USER_QUERY = gql`
  query User($userId: ID!) {
    User(userId: $userId) {
      id
      name
      email
      isAdmin
      isPremium
      avatar
    }
  }
`;



const UserRecipes = () => {
  const router = useRouter();
  const uid = router.query.uid;

  const recipes = useQuery(USER_RECIPES, {
    variables: {
      userId: uid,
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
      {recipes.data && !recipes.loading && !recipes.error && (
        <Box>
          {recipes.data &&
            !recipes.loading &&
            !recipes.error &&
            recipes.data.userRecipes.map((recipe: any) => (
              <RecipeCard key={recipe.recipeId} {...recipe} />
            ))}
        </Box>
      )}
    </Box>
  );  
  
}

const Profile = () => {
  const router = useRouter();
  const uid = router.query.uid;

  const user = useQuery(USER_QUERY, {
    variables: {
      userId: uid,
    },
    onCompleted: (res) => {
      console.log(res);
    },
    onError: (err) => {
      console.error(err);
    },
  });

  const [userAuth, userAuthLoading] = useAuthState(getAuth());


return (
  <Box w="500px" maxW="100%">
    <Box w="100%" display="flex" flexDirection="column" mb={4}>
      {!userAuthLoading && userAuth?.uid === user.data?.User[0].id && (
        <Box w="100%" display="flex" justifyContent="flex-end">
          <Button>Edit Profile</Button>
        </Box>
      )}
    </Box>
    {!user.loading && !user.error && (
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
        <Box display="flex" flexDir="column">
          <Box display="flex" alignItems="center">
            <Avatar size="xl" src={user.data.User[0].avatar} />
            <Text ml={4} fontSize="2xl">
              {user.data.User[0].name}
            </Text>
            
          </Box>
        </Box>

      </Box>
      <Box w="500px" maxW="100%" mt={4}><UserRecipes /></Box>
      </>
    )}
  </Box>
);
};

export default Profile;
