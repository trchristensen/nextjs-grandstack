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
  BiLogOut,
  BiLogIn,
  BiPlus,
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
          flexGrow={1}
          flexShrink={1}
          alignItems="flex-end"
          flexDir="column"
          // minW="200px"
        >
          <Box
            // w="200px"
            maxW="100%"
            height="100vh"
            position="fixed"
            overflowY="auto"
            pl={1}
            pr={1}
          >
            <Box
              position="relative"
              minH="550px"
              height="100%"
              d="flex"
              flexDir="column"
              justifyContent="space-between"
            >
              <Box id="sidebar-left__top">
                <Heading
                  as="h1"
                  size="lg"
                  letterSpacing={"-.1rem"}
                  mt="22px"
                  mb="56px"
                >
                  JS
                </Heading>
                <Box id="sidebar-left__main">
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
                            <Icon
                              w={8}
                              h={8}
                              color="gray.600"
                              as={BiNotification}
                            />
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
                            <Icon
                              w={8}
                              h={8}
                              color="gray.600"
                              as={BiBookmark}
                            />
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
                            </Box>
                          </a>
                        </Link>
                        <Button
                          mt={10}
                          rounded="full"
                          variantColor="gray"
                          borderColor="gray.500"
                          variant="outline"
                          p={0}
                        >
                          <Icon as={BiPlus} />
                        </Button>
                      </Box>
                    )}
                  </Stack>
                </Box>
              </Box>
              <Box id="sidebar-left__bottom" mb="40px">
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
                            src={`${user.photoURL}`}
                            name={`${user.displayName}`}
                          />

                          <Icon as={BiChevronDown} />
                        </MenuButton>
                        <MenuList color="gray.500">
                          <MenuItem onClick={() => logout()}>
                            <Icon as={BiLogOut} mr={1} />
                            Logout
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </Box>
                  </Box>
                ) : (
                  <Box>
                    <Link href="/login">
                      <Button>
                        <a>
                          <Icon as={BiLogIn} mr={1} />
                          Login
                        </a>
                      </Button>
                    </Link>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
        <Box
          id="feed"
          display="flex"
          flexGrow={1}
          flexShrink={1}
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
  );};

export default MainLayout;
