import React from "react";
import Link from "next";
import { useAuthState } from "react-firebase-hooks/auth";
import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import {
  loginWithGithub,
  loginWithGoogle,
  getAuth,
  logout,
} from "../../firebaseHelpers";

import { Box, Heading, Flex, Text, Button, Avatar } from "@chakra-ui/core";

export function Login(props: any) {
  const [user, loading] = useAuthState(getAuth());


   return !loading && user ? (
     <Box display="flex" fontSize="xl" justifyContent="center" alignItems="center" mt="40px">
       You are logged in!
     </Box>
   ) : (
     <Box display="flex" justifyContent="center" alignItems="center">
       <Box
         w="500px"
         maxW="100%"
         bg="white"
         rounded="lg"
         shadow="md"
         display="flex"
         flexWrap="wrap"
         justifyContent="center"
         alignItems="center"
         py={6}
         px={6}
       >
         <Text fontSize="2xl" fontWeight="bold" mb={6}>
           Login
         </Text>
         <Button
           variantColor="pink"
           onClick={() => loginWithGithub()}
           display="flex"
           w="100%"
           flexWrap="wrap"
         >
           Login with Github
         </Button>
         <Button
           variantColor="pink"
           onClick={() => loginWithGoogle()}
           display="flex"
           w="100%"
           flexWrap="wrap"
           mt={6}
         >
           Login with Google
         </Button>
       </Box>
     </Box>
   );
}

export default Login;
