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

import {
  Box,
  Heading,
  Flex,
  Text,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Icon
} from "@chakra-ui/core";
import { BiChevronDown } from "react-icons/bi";




export function Header(props:any) {
  const [user, loading] = useAuthState(getAuth());

  return (
    <header>
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        wrap="wrap"
        px="1.5rem"
        py=".6rem"
        bg="blue.500"
        color="white"
        {...props}
      >
        <Flex align="center" mr={5}>
          <Heading as="h1" size="lg" letterSpacing={"-.1rem"}>
            JuiceSauce
          </Heading>
        </Flex>
   
          {!loading && user ? (
            <Box display="flex">
              <Box display="flex" alignItems="center">
                <Menu>
                  <MenuButton
                    // px={4}
                    py={2}
                    transition="all 0.2s"
                    borderRadius="md"
                    // _hover={{ bg: "gray.100" }}
                    _focus={{ outline: 0, boxShadow: "outline" }}
                    bg="transparent"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Avatar
                      marginRight={2}
                      size="sm"
                      name={user.displayName}
                      src={user.photoURL}
                    />
                    <Text>{user.displayName}</Text>
                    <Icon as={BiChevronDown} />
                  </MenuButton>
                  <MenuList color="gray.500">
                    <MenuItem>
                      <Link href="/dashboard">
                        <a>Dashboard</a>
                      </Link>
                    </MenuItem>
                    <MenuDivider />
                    <MenuItem onClick={() => logout()}>Logout</MenuItem>
                  </MenuList>
                </Menu>
              </Box>
            </Box>
          ) : (
            <Box>
              <Link href="/login">
                <a>Login</a>
              </Link>
            </Box>
          )}
        
      </Flex>
    </header>
  );
}
