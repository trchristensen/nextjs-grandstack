import React from 'react'
// import { GetServerSideProps } from "next";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth, logout } from "../firebaseHelpers";

import {
  Avatar,
  Box,
  Text,
  Button,
  Stack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  MenuDivider,
  Icon,
  Heading,
} from "@chakra-ui/core";
import {
  BiChevronDown,
  BiHome,
  BiSearch,
  BiNotification,
  BiBookmark,
  BiHash,
  BiUser,
  BiGitRepoForked,
} from "react-icons/bi";

const MainLayout = ({ children }: any) => {
  const [user, loading] = useAuthState(getAuth());
  return (
  
  <Box>
    {/* <Header /> */}
    <Box display="flex" justifyContent="center" pt={8}>
      <Box
        id="sidebar-left"
        display="flex"
        flexGrow="1"
        flexShrink="1"
        alignItems="flex-end"
        flexDir="column"
      >
        <Box w="175px" maxW="100%">
          <Box id="sidebar-left__top" position="fixed" top="40px">
            <Heading as="h1" size="lg" letterSpacing={"-.1rem"}>
              JuiceSauce
            </Heading>
          </Box>
          <Box id="sidebar-left__main" position="fixed" top="100px">
            <Stack direction={"column"} spacing={6} align="stretch">
              <Box>
                <Link href="/">
                  <a>
                    <Box
                      display="flex"
                      flexDir="row"
                      alignItems="center"
                      justifyContent="flex-start"
                    >
                      <Icon w={8} h={8} color="gray.600" as={BiHome} />
                      <Text ml={2} fontWeight="bold">
                        Home
                      </Text>
                    </Box>
                  </a>
                </Link>
              </Box>
              <Box>
                <Link href="/explore">
                  <a>
                    <Box
                      display="flex"
                      flexDir="row"
                      alignItems="center"
                      justifyContent="flex-start"
                    >
                      <Icon w={8} h={8} color="gray.600" as={BiHash} />
                      <Text ml={2} fontWeight="bold">
                        Explore
                      </Text>
                    </Box>
                  </a>
                </Link>
              </Box>
              <Box>
                <Link href="/notifications">
                  <a>
                    <Box
                      display="flex"
                      flexDir="row"
                      alignItems="center"
                      justifyContent="flex-start"
                    >
                      <Icon w={8} h={8} color="gray.600" as={BiNotification} />
                      <Text ml={2} fontWeight="bold">
                        Notifications
                      </Text>
                    </Box>
                  </a>
                </Link>
              </Box>
              <Box>
                <Link href="/bookmarks">
                  <a>
                    <Box
                      display="flex"
                      flexDir="row"
                      alignItems="center"
                      justifyContent="flex-start"
                    >
                      <Icon w={8} h={8} color="gray.600" as={BiBookmark} />
                      <Text ml={2} fontWeight="bold">
                        Bookmarks
                      </Text>
                    </Box>
                  </a>
                </Link>
              </Box>
              {!loading && user && (
                <Box>
                  <Link href={`/u/${user.uid}`}>
                    <a>
                      <Box
                        display="flex"
                        flexDir="row"
                        alignItems="center"
                        justifyContent="flex-start"
                      >
                        <Icon w={8} h={8} color="gray.600" as={BiUser} />
                        <Text ml={2} fontWeight="bold">
                          Profile
                        </Text>
                      </Box>
                    </a>
                  </Link>
                </Box>
              )}
            </Stack>
          </Box>
          <Box id="sidebar-left__bottom" position="fixed" bottom="40px">
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
          </Box>
        </Box>
      </Box>
      <Box
        id="feed"
        display="flex"
        flexGrow="1"
        flexShrink="1"
        alignItems="flex-start"
        flexDir="column"
        px={6}
        w="500px"
        maxW="100%"
      >
       {children}
      </Box>
      {/* <Box
          id="sidebar-right"
          display="flex"
          flexGrow="1"
          flexShrink="1"
          alignItems="flex-start"
          flexDir="column"
        >
          <Box
            position="fixed"
            top="100px"
            bg="white"
            shadow="md"
            rounded="lg"
            h="500px"
            w="175px"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            Search area
          </Box>
        </Box> */}
    </Box>
  </Box>
)};

export default MainLayout;
