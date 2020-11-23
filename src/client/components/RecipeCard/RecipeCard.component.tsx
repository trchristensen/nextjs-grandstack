import React from "react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth, logout } from "../../../client/firebaseHelpers";
import { LikesAndComments } from "../LikesAndComments/LikesAndComments.component";

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
  Tag,
  useToast
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
  BiBookBookmark,
  BiTrash,
  BiEdit,
  BiLike,
  BiDislike,
  BiComment,
} from "react-icons/bi";

import { formatDistanceToNow } from "date-fns";
import { CreateRandomID } from "../../../helpers/CreateRandomId";

export const ARCHIVE_RECIPE = gql`
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
      numComments
    }
  }
`;

const ADD_RECIPE_LIKE = gql`
  mutation addRecipeLike(
    $userId: String!
    $recipeId: String!
    $likeId: ID!
    $timestamp: String!
  ) {
    addRecipeLike(
      userId: $userId
      recipeId: $recipeId
      likeId: $likeId
      timestamp: $timestamp
    ) {
      userId
    }
  }
`;

const REMOVE_RECIPE_LIKE = gql`
  mutation removeRecipeLike(
    $userId: String!
    $recipeId: String!
    $likeId: ID!
    $timestamp: String!
  ) {
    removeRecipeLike(
      userId: $userId
      recipeId: $recipeId
      likeId: $likeId
      timestamp: $timestamp
    ) {
      userId
    }
  }
`;

export const LikeBox = (recipe:Recipe) => {
  const toast = useToast();
  const [addLike] = useMutation(ADD_RECIPE_LIKE, {
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
      likeId: CreateRandomID(16),
      timestamp: new Date().toISOString(),
    },
    onCompleted: (res) => {
      console.log(res);
      setLiked(liked);
      toast({
        title: "Success",
        description: `Recipe has been liked!`,
        status: "success",
        position: "bottom-right",
        duration: 8000,
        isClosable: true,
      });
    },
    onError: (err) => {
      console.error(err);
      setNumLikes(numLikes - 1);
      toast({
        title: "Error",
        description: `${err}`,
        status: "error",
        position: "bottom-right",
        duration: 8000,
        isClosable: true,
      });
    },
  });

  const [removeLike] = useMutation(REMOVE_RECIPE_LIKE, {
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
      likeId: CreateRandomID(16),
      timestamp: new Date().toISOString(),
    },
    onCompleted: (res) => {
      console.log(res);
      setLiked(false);
      toast({
        title: "Success",
        description: `Recipe has been unliked!`,
        status: "success",
        position: "bottom-right",
        duration: 8000,
        isClosable: true,
      });
    },
    onError: (err) => {
      console.error(err);
      setNumLikes(numLikes + 1);
    },
  });

  const [liked, setLiked] = React.useState<Boolean>(false);
  const [numLikes, setNumLikes] = React.useState(0);
  const [userAuth, userAuthLoading] = useAuthState(getAuth());

  React.useEffect(() => {
    recipe.likes?.map((like: any) => {
      setNumLikes(recipe.likes.length)
      if (like.userId == userAuth?.uid) {
        setLiked(true);
      } else {
        setLiked(false);
      }
    });
  }, [recipe]);

  const handleLike = () => {
    console.log("clicked the fucking like button");

    if (recipe.likes.length == undefined || recipe.likes.length == null || recipe.likes.length == 0) {
      addLike();
      setLiked(true)
      setNumLikes(numLikes + 1)
    } else {
      recipe.likes?.map((like: any) => {
        console.log("userauth id is contained in the recipe likes");
  
        if (!liked) {
          addLike();
          setLiked(true)
          setNumLikes(numLikes + 1);
        } else {
          removeLike();
          setLiked(false)
          setNumLikes(numLikes - 1);
        }
      });
    }

      
  };

  return (
    <Box d="flex" justifyContent="center" alignItems="center">
      <Box>{numLikes}</Box>
      <Button
        onClick={() => handleLike()}
        ml={2}
        transition="all 0.2s"
        // borderWidth="1px"
        color="gray.500"
        bg={liked ? `gray.100` : null}
        rounded="full"
        _hover={{ bg: "gray.100" }}
        _expanded={{ bg: "red.200" }}
        _focus={{ outline: 0, boxShadow: "outline" }}
        alignItems="center"
        w="40px"
        h="40px"
        d="flex"
        justifyContent="center"
        alignItems="center"
        minW="none"
        p={0}
      >
        <Icon
          color={liked && `gray.500`}
          as={BiLike}
          ml={2}
          size={5}
          ml="-.05em"
        />
      </Button>
    </Box>
  );
}

export function RecipeCard(recipe: Recipe) {
  const [userAuth, userAuthLoading] = useAuthState(getAuth());

  const [archive] = useMutation(ARCHIVE_RECIPE, {
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
                  <a>{recipe.creator?.name}</a>
                </Link>
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
                  <MenuItem>
                    <Icon as={BiEdit} mr={1} />
                    Edit
                  </MenuItem>
                  <MenuItem onClick={() => archive()}>
                    <Icon as={BiTrash} mr={1} />
                    Delete
                  </MenuItem>
                  <MenuDivider />
                </>
              )}

              <MenuItem>
                <Icon mr={1} as={BiGitRepoForked} />
                Remix
              </MenuItem>
              <MenuItem>
                <Icon mr={1} as={BiBookmark} />
                Bookmark
              </MenuItem>
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
                    backgroundColor="gray.500"
                    key={ingredient.Flavor.flavorId}
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
        <Box className="recipe__tags" mt={1}>
          <Stack spacing={1} direction="row" flexWrap="wrap">
            {recipe.tags?.map((tag: any) => {
              return (
                <Tag key={tag.tagId + CreateRandomID(6)} mt={1} size="sm">
                  {tag?.name}
                </Tag>
              );
            })}
          </Stack>
        </Box>
        <Box mt={3}>
          <Box className="likesAndComments">
            <Box
              className="lac__statusBar"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box d="flex" alignItems="center" color="gray.600">
                {recipe.numComments > 0 && recipe.numComments}{" "}
                <Icon size={5} ml={1} as={BiComment} />
              </Box>
              <Box className="likesAndDislikes" d="flex" flexDir="row">
               <LikeBox {...recipe} {...userAuth} />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
