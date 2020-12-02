import { useRouter } from "next/router";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "../../client/firebaseHelpers";
import BackBar from "../../client/components/BackBar/BackBar.component";

import {
  Avatar,
  Box,
  Text,
  Button
} from "@chakra-ui/core";
import { GetRecipes } from "../../client/components/GetRecipes/GetRecipes.component";

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
  let filter = {
    creator: { id: uid },
  };

return (
  <Box w="500px" maxW="100%">
    <BackBar title="User">
      {!userAuthLoading && userAuth?.uid === user.data?.User[0].id && (
        <Box w="100%" display="flex" justifyContent="flex-end">
          <Button>Edit Profile</Button>
        </Box>
      )}
    </BackBar>
    <Box w="100%" display="flex" flexDirection="column" mb={4}></Box>
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
        <Box w="500px" maxW="100%" mt={4}>
          {/* <UserRecipes /> */}
          <GetRecipes {...filter} />
        </Box>
      </>
    )}
  </Box>
);
};

export default Profile;
