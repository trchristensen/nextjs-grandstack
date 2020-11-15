import React from "react";
import Link from "next";
import { useAuthState } from "react-firebase-hooks/auth";
import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import {
  loginWithGithub,
  loginWithGoogle,
  signInWithEmailandPassword,
  createNewUserWithEmailandPassword,
  getAuth,
  logout,
} from "../../firebaseHelpers";

import { Box, Heading, Flex, Text, Button, Avatar, Input } from "@chakra-ui/core";

export function Login(props: any) {
  const [user, loading] = useAuthState(getAuth());
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const handleCreateUser = () => {
    createNewUserWithEmailandPassword(email, password);
  }

   return !loading && user ? (
     <Box
       display="flex"
       fontSize="xl"
       justifyContent="center"
       alignItems="center"
       mt="40px"
     >
       You are logged in!
     </Box>
   ) : (
     <Box display="flex" justifyContent="center" alignItems="center">
       <Box
         w="700px"
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
         <Box>
           <Input
             value={email}
             onChange={(e: React.FormEvent<HTMLInputElement>) =>
               setEmail(e.currentTarget.value)
             }
           />
           <Input
            type="password"
             value={password}
             onChange={(e: React.FormEvent<HTMLInputElement>) =>
               setPassword(e.currentTarget.value)
             }
           />
           <Button onClick={() => handleCreateUser()}>Create User</Button>
         </Box>
         <Box>
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
           <Button
             variantColor="pink"
             onClick={() =>
               signInWithEmailandPassword("testemail@gmail.com", "password!1")
             }
             display="flex"
             w="100%"
             flexWrap="wrap"
             mt={6}
           >
             Sign in with email and pass
           </Button>
         </Box>
       </Box>
     </Box>
   );
}

export default Login;
