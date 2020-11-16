import React from "react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Header } from "../client/components/Header";

import { CreateRecipe } from "../client/components/CreateRecipe/CreateRecipe.component";
import { useArchiveRecipeMutation, Recipe, Flavor } from "../client/gen/index";

import {
  Avatar,
  Box,
  Text,
  Button,
  Stack,
  Tooltip,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  MenuDivider,
  Icon,
} from "@chakra-ui/core";
import {
  BiChevronDown,
  BiHome,
  BiSearch,
  BiNotification,
  BiBookmark,
  BiHash,
} from "react-icons/bi";

import { formatDistanceToNow } from "date-fns";

type Props = {};

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  console.log("ctx", ctx);
  return {
    props: {},
  };
};

const RECIPES_NOT_ARCHIVED = gql`
  query recipesNotArchived(
    $first: Int
    $offset: Int
    $orderBy: [_RecipeOrdering]
  ) {
    recipesNotArchived(first: $first, offset: $offset, orderBy: $orderBy) {
      recipeId
      name
      description
      published
      lastEdited
      creator {
        id
        name
        avatar
      }
      parent {
        recipeId
        name
      }
      ingredients {
        amount
        measurement
        Flavor {
          flavorId
          name
        }
      }
      tags {
        name
        tagId
      }
    }
  }
`;

export const archiveRecipe = gql`
  mutation archiveRecipe($recipeId: ID!, $userId: ID!) {
    archiveRecipe(recipeId: $recipeId, userId: $userId) {
      recipeId
      name
      isArchived
      creator {
        id
        name
      }
    }
  }
`;

function RecipeCard(recipe: Recipe) {
  const [archive] = useMutation(archiveRecipe, {
    refetchQueries: [
      {
        query: RECIPES_NOT_ARCHIVED,
        variables: {
          orderBy: "published_desc",
        },
      },
    ],
    variables: {
      userId: recipe.creator?.id,
      recipeId: recipe.recipeId,
    },
    onCompleted: (res) => {
      console.log(res);
    },
    onError: (err) => {
      console.error(err);
    },
  });

  return (
    <Box
      className="recipeCard"
      marginBottom={4}
      p={4}
      shadow="md"
      rounded="lg"
      display="block"
      bg="white"
      width="full"
    >
      <Box
        className="recipeCard__header"
        display="flex"
        flexDirection="row"
        alignItems="items-start"
        justifyContent="space-between"
      >
        <Box width="full" display="flex" flexDirection="row">
          <Avatar
            bg="gray.500"
            size="sm"
            name="author name"
            mt={1}
            src={recipe.creator?.avatar}
          ></Avatar>
          <Box
            className="recipeCard__header-info"
            display="flex"
            flexDirection="column"
            width="100%"
            px={2}
          >
            <Text
              as="span"
              fontSize="lg"
              lineHeight="shorter"
              fontWeight="bold"
              px={0}
            >
              {recipe.name}
            </Text>
            <Box
              className="recipeCard__header-info-details"
              display="flex"
              flexWrap="wrap"
              flexDirection="row"
              alignItems="flex-end"
              fontSize="sm"
            >
              <Text
                color="text-gray-60"
                as="span"
                lineHeight="shorter"
                display="flex"
              >
                {recipe.creator?.name}
                <Text mx={1}>{" • "} </Text>
                {formatDistanceToNow(
                  //@ts-ignore
                  new Date(recipe.published)
                )}{" "}
                {recipe.isArchived && ` - Archived`}
              </Text>
            </Box>
          </Box>
          <Menu>
            <MenuButton
              py={2}
              px={3}
              transition="all 0.2s"
              // borderWidth="1px"
              color="gray.500"
              rounded="full"
              _hover={{ bg: "gray.100" }}
              _expanded={{ bg: "red.200" }}
              _focus={{ outline: 0, boxShadow: "outline" }}
            >
              <Icon as={BiChevronDown} />
            </MenuButton>
            <MenuList>
              //if this is the users..
              <MenuItem>Edit</MenuItem>
              <MenuItem onClick={() => archive()}>Delete</MenuItem>
              <MenuDivider />
              <MenuItem>Fork It</MenuItem>
              <MenuItem>Bookmark it</MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Box>
      <Box className="recipeCard__content">
        <Box mt={2} mb={3}>
          <Text>{recipe.description}</Text>
          {/* <Box>[Flavor details here]</Box> */}
        </Box>
        <Box>
          <Stack
            className="w-full border rounded-lg overflow-hidden ingredientsBar"
            bg={"gray.200"}
            overflow="hidden"
            borderRadius="lg"
            border={1}
            w="full"
            spacing={0}
            isInline
          >
            {recipe.ingredients &&
              recipe.ingredients?.map((ingredient: any) => {
                return (
                  <Box
                    style={{ width: `${ingredient.amount}%` }}
                    // key={ingredient.Flavor.flavorId}
                    className="ingredientsBar__ingredient text-gray-700 font-semibold text-xs flex justify-center items-center flex-row border-r border-gray-200"
                  >
                    <Tooltip
                      aria-label="tooltip"
                      label={`${ingredient.Flavor.name} - ${ingredient.amount}
                      ${ingredient.measurement}`}
                      placement="bottom"
                    >
                      <div
                        className="w-full text-center relative block"
                        style={{ height: "10px" }}
                      ></div>
                    </Tooltip>
                  </Box>
                );
              })}
          </Stack>
        </Box>
        <Box className="recipe__tags">
          {recipe.tags?.map((tag) => {
            return <li>{tag?.name}</li>;
          })}
        </Box>
      </Box>
    </Box>
  );
}

const GetRecipes = () => {
  const { loading, data, error } = useQuery(RECIPES_NOT_ARCHIVED, {
    notifyOnNetworkStatusChange: true,
    variables: {
      orderBy: "published_desc",
    },
  });

  return (
    <main>
      <div
        style={{
          marginTop: "30px",
          maxWidth: "500px",
          display: "block",
          width: "100%",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        {loading && !error && <p>Loading...</p>}
        {error && !loading && <p>Error: {JSON.stringify(error)}</p>}
        {data &&
          !loading &&
          !error &&
          data.recipesNotArchived.map((recipe: any) => (
            <RecipeCard key={recipe.recipeId} {...recipe} />
          ))}
      </div>
    </main>
  );
};

const RecipesPage = () => {
  return (
    <Box>
      <Header />
      <Box display="flex" justifyContent="center" pt={8}>
        <Box id="sidebar-left" display="flex" flexGrow="1" alignItems="flex-end" flexDir="column">
          <Box position="fixed" top="100px">
            <Stack direction={"column"} spacing={5} align="stretch">
              <Box>
                <Link href="/">
                  <a>
                    <Box
                      display="flex"
                      flexDir="row"
                      alignItems="center"
                      justifyContent="flex-start"
                    >
                      <Icon w={10} h={10} color="gray.600" as={BiHome} />
                      <Text ml={2} fontWeight="bold">
                        Home
                      </Text>
                    </Box>
                  </a>
                </Link>
              </Box>
              <Box>
                <Link href="/">
                  <a>
                    <Box
                      display="flex"
                      flexDir="row"
                      alignItems="center"
                      justifyContent="flex-start"
                    >
                      <Icon w={10} h={10} color="gray.600" as={BiHash} />
                      <Text ml={2} fontWeight="bold">
                        Explore
                      </Text>
                    </Box>
                  </a>
                </Link>
              </Box>
              <Box>
                <Link href="/">
                  <a>
                    <Box
                      display="flex"
                      flexDir="row"
                      alignItems="center"
                      justifyContent="flex-start"
                    >
                      <Icon
                        w={10}
                        h={10}
                        color="gray.600"
                        as={BiNotification}
                      />
                      <Text ml={2} fontWeight="bold">
                        Notifications
                      </Text>
                    </Box>
                  </a>
                </Link>
              </Box>
              <Box>
                <Link href="/">
                  <a>
                    <Box
                      display="flex"
                      flexDir="row"
                      alignItems="center"
                      justifyContent="flex-start"
                    >
                      <Icon w={10} h={10} color="gray.600" as={BiBookmark} />
                      <Text ml={2} fontWeight="bold">
                        Bookmarks
                      </Text>
                    </Box>
                  </a>
                </Link>
              </Box>
            </Stack>
          </Box>
        </Box>
        <Box id="feed" px={6}>
          <CreateRecipe />

          <GetRecipes />
        </Box>
        <Box id="sidebar-right" display="flex" flexGrow="1" alignItems="flex-end" flexDir="column"></Box>
      </Box>
    </Box>
  );
};

export default RecipesPage;
