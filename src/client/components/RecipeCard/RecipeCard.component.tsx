import React from "react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth, logout } from "../../../client/firebaseHelpers";


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

import { formatDistanceToNow } from "date-fns";


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

export function RecipeCard(recipe: Recipe) {
  const [userAuth, userAuthLoading] = useAuthState(getAuth());


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
      width="100%"
    >
      <Box
        className="recipeCard__header"
        display="flex"
        flexDirection="row"
        alignItems="items-start"
        justifyContent="space-between"
      >
        <Box width="full" display="flex" flexDirection="row">
          <Link href={`/u/${recipe.creator?.id}`}>
            <a>
              <Avatar
                bg="gray.500"
                size="sm"
                name="author name"
                mt={1}
                src={recipe.creator?.avatar}
              ></Avatar>
            </a>
          </Link>
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
            {recipe.parent && <Icon as={BiGitRepoForked} />}
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
                <Link href={`/u/${recipe.creator?.id}`}>
            <a>
                {recipe.creator?.name}the fuck
                </a></Link>
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
              {!userAuthLoading && userAuth?.uid === recipe.creator.id && (
                <>
                  <MenuItem>Edit</MenuItem>
                  <MenuItem onClick={() => archive()}>Delete</MenuItem>
                  <MenuDivider />
                </>
              )}

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