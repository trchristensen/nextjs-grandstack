import React from 'react';
import Link from 'next/link';
import { useAuthState } from "react-firebase-hooks/auth";
import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import {
  loginWithGithub,
  loginWithGoogle,
  getAuth,
  logout,
} from "../../client/firebaseHelpers";

import { Box, Heading, Flex, Text, Button, Avatar } from "@chakra-ui/core";




export function Header(props:any) {
  const [user, loading] = useAuthState(getAuth());
  console.log('user:', user);

  const [show, setShow] = React.useState(false);
  const handleToggle = () => setShow(!show);


  return (
    <header>
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        wrap="wrap"
        padding="1.5rem"
        bg="gray.500"
        color="white"
        {...props}
      >
        <Flex align="center" mr={5}>
          <Heading as="h1" size="lg" letterSpacing={"-.1rem"}>
            JuiceSauce
          </Heading>
        </Flex>

        <Box display={{ base: "block", md: "none" }} onClick={handleToggle}>
          <svg
            fill="white"
            width="12px"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </Box>

        <Box
          display={{ sm: show ? "block" : "none", md: "flex" }}
          width={{ sm: "full", md: "auto" }}
          alignItems="center"
          flexGrow={1}
        ></Box>

        <Box
          display={{ sm: show ? "block" : "none", md: "block" }}
          mt={{ base: 4, md: 0 }}
        >
          {!loading && user ? (
            <Box display="flex">
              <Box marginRight={4} display="flex" alignItems="center">
                <Avatar
                  marginRight={1}
                  size="sm"
                  name={user.displayName}
                  src={user.photoURL}
                />
                <Text>{user.displayName}</Text>
              </Box>
              <Button variantColor="pink" onClick={() => logout()}>
                Logout
              </Button>
            </Box>
          ) : (
            <Box>
              <Link href="/login">
                <a>Login</a>
              </Link>
            </Box>
          )}
        </Box>
      </Flex>
    </header>
  );
}
