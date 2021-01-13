import React from "react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "../../../client/firebaseHelpers";
// import { Recipe, Flavor } from "../../gen/index";
import { RECIPES_QUERY, DELETE_RECIPE } from "../../gql/recipes";

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
  useToast,
  useClipboard,
  Grid,
} from "@chakra-ui/core";
import { GridItem } from "@chakra-ui/react";
import {
  BiChevronDown,
  BiHome,
  BiSearch,
  BiNotification,
  BiBookmark,
  BiUser,
  BiGitRepoForked,
  BiBookBookmark,
  BiTrash,
  BiEdit,
  BiLike,
  BiDislike,
  BiComment,
  BiCopy,
  BiHash,
} from "react-icons/bi";

import { formatDistanceToNow } from "date-fns";
import { CreateRandomID } from "../../../helpers/CreateRandomId";
import LikesAndComments from "../LikesAndComments/LikesAndComments.component";

export function RecipeCard(recipe: any) {
  const [userAuth, userAuthLoading] = useAuthState(getAuth());
  const { hasCopied, onCopy } = useClipboard(
    `https://juicesauce.com/recipes/${recipe.recipeId}`
  );

  // this should be taken from a cookie.
  // const preferredVolume = React.useState<number>(10);
  const preferredVolume = 10

  let filter = {};
  const router = useRouter();
  const tag = router.query.tag;
  const q = router.query.q;

  if (tag) {
    filter = {
      ...filter,
      tags_single: { name_contains: tag },
    };
  }
  if (q) {
    filter = {
      ...filter,
      name_contains: q,
    };
  }

  const [deleteRecipe] = useMutation(DELETE_RECIPE, {
    refetchQueries: [
      {
        query: RECIPES_QUERY,
        variables: {
          orderBy: "published_desc",
          first: 20,
          offset: 0,
          filter: filter,
        },
      },
    ],
    variables: {
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
                src={`${recipe.creator?.avatar}`}
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
            <Box d="flex" flexDir="row" alignItems="center">
              <Link href={`/recipes/${recipe.recipeId}`}>
                <a>
                  <Text
                    as="span"
                    fontSize="lg"
                    lineHeight="shorter"
                    fontWeight="bold"
                    px={0}
                  >
                    {recipe.name}
                  </Text>
                </a>
              </Link>
              {recipe.parent && (
                <Link href={`/recipes/${recipe.parent.recipeId}`}>
                  <a>
                    <Icon ml="2" mb="4px" color="gray.600" as={BiGitRepoForked} />
                  </a>
                </Link>
              )}
            </Box>
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
              _hover={{ bg: "gray.100", shadow: "sm" }}
              _expanded={{ bg: "gray.200" }}
              _focus={{ outline: 0, boxShadow: "none" }}
            >
              <Icon as={BiChevronDown} />
            </MenuButton>
            <MenuList>
              {!userAuthLoading && userAuth?.uid === recipe.creator?.id && (
                <>
                  <MenuItem>
                    <Link href={`/recipes/edit/?recipeId=${recipe.recipeId}`}>
                      <a style={{ width: "100%" }}>
                        <Icon as={BiEdit} mr={1} />
                        Edit
                      </a>
                    </Link>
                  </MenuItem>
                  <MenuItem onClick={() => deleteRecipe()}>
                    <Icon as={BiTrash} mr={1} />
                    Delete
                  </MenuItem>
                  <MenuDivider />
                </>
              )}
              <MenuItem onClick={onCopy}>
                <Icon mr={1} as={BiCopy} />
                Copy URL
              </MenuItem>
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
        <Box className="ingredients-table" mb={3}>
          <Grid borderBottomWidth={2} templateColumns="repeat(5, 1fr)" gap={1}>
            <GridItem colSpan={2} h="auto">
              <Text as="span" fontSize="sm" fontStyle="italic" color="gray.600">
                Ingredients
              </Text>
            </GridItem>
            <GridItem h="auto" textAlign="right">
              <Text as="span" fontSize="sm" fontStyle="italic" color="gray.600">
                g
              </Text>
            </GridItem>
            <GridItem h="auto" textAlign="right">
              <Text as="span" fontSize="sm" fontStyle="italic" color="gray.600">
                ml
              </Text>
            </GridItem>
            <GridItem h="auto" textAlign="right">
              <Text as="span" fontSize="sm" fontStyle="italic" color="gray.600">
                %
              </Text>
            </GridItem>
          </Grid>

          <Grid borderBottomWidth={1} templateColumns="repeat(5, 1fr)" gap={1}>
            <GridItem colSpan={2} h="auto">
              <Text as="span" fontSize="sm">
                Base
              </Text>
            </GridItem>
            <GridItem h="auto" textAlign="right">
              <Text as="span" fontSize="sm">
                {recipe.mixingPercentage / preferredVolume}
              </Text>
            </GridItem>
            <GridItem h="auto" textAlign="right">
              <Text as="span" fontSize="sm">
                {recipe.mixingPercentage / preferredVolume}
              </Text>
            </GridItem>
            <GridItem h="auto" textAlign="right">
              <Text as="span" fontSize="sm">
                {recipe.mixingPercentage}
              </Text>
            </GridItem>
          </Grid>

          {recipe.ingredients &&
            recipe.ingredients?.map((ingredient: any) => {
              return (
                <Grid
                  borderBottomWidth={1}
                  templateColumns="repeat(5, 1fr)"
                  gap={1}
                >
                  <GridItem colSpan={2} h="auto">
                    <Text as="span" fontSize="sm">
                      <Link href={`/flavors/${ingredient.Flavor.flavorId}`}>
                        <a>
                          <Text as="span" fontSize="sm">
                            {ingredient.Flavor.name}
                          </Text>
                        </a>
                      </Link>
                    </Text>
                  </GridItem>
                  <GridItem h="auto" textAlign="right">
                    <Text fontSize="sm" as="span">
                      {Math.round(
                        ((ingredient.percentage / 100) * preferredVolume +
                          Number.EPSILON) *
                          100
                      ) / 100}
                    </Text>
                  </GridItem>
                  <GridItem h="auto" textAlign="right">
                    <Text fontSize="sm" as="span">
                      {Math.round(
                        ((ingredient.percentage / 100) * preferredVolume +
                          Number.EPSILON) *
                          100
                      ) / 100}
                    </Text>
                  </GridItem>
                  <GridItem h="auto" textAlign="right">
                    <Text fontSize="sm" as="span">
                      {ingredient.percentage}
                    </Text>
                  </GridItem>
                </Grid>
              );
            })}

          <Grid borderTopWidth={1} templateColumns="repeat(5, 1fr)" gap={1}>
            <GridItem colSpan={2} h="auto">
              <Text as="span" fontSize="sm" fontStyle="italic" color="gray.600">
                Total
              </Text>
            </GridItem>
            <GridItem h="auto" textAlign="right">
              <Text as="span" fontSize="sm" fontStyle="italic" color="gray.600">
                {preferredVolume} g
              </Text>
            </GridItem>
            <GridItem h="auto" textAlign="right">
              <Text as="span" fontSize="sm" fontStyle="italic" color="gray.600">
                {preferredVolume} ml
              </Text>
            </GridItem>
            <GridItem h="auto" textAlign="right">
              <Text as="span" fontSize="sm" fontStyle="italic" color="gray.600">
                100%
              </Text>
            </GridItem>
          </Grid>
        </Box>
        <Box w="full" d="flex" justifyContent="space-between" px=".025rem">
          {/* <Text as="span" fontSize="sm" fontStyle="italic" color="gray.600">
            Suggested Mix: {recipe.mixingPercentage}%
          </Text> */}
          {recipe.steepTime > 0 && (
            <Text as="span" fontSize="sm" fontStyle="italic" color="gray.600">
              Steep Time: {recipe.steepTime} days
            </Text>
          )}
        </Box>
        <Box
          bg={"gray.100"}
          overflow="hidden"
          borderRadius="lg"
          border={1}
          w="full"
        >
          <Stack
            className="ingredientsBar"
            w={`${recipe.mixingPercentage}%`}
            spacing={0}
            isInline
          >
            {recipe.ingredients &&
              recipe.ingredients?.map((ingredient: any) => {
                return (
                  <Box
                    style={{ width: `${ingredient.percentage}%` }}
                    backgroundColor="gray.400"
                    key={ingredient.Flavor.flavorId}
                    className="ingredientsBar__ingredient text-gray-700 font-semibold text-xs flex justify-center items-center flex-row border-r border-gray-200"
                  >
                    <Tooltip
                      aria-label="tooltip"
                      label={`${ingredient.Flavor.name}`}
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

        <Box
          className="recipe__tags"
          mt={1}
          d="flex"
          flexDir="row"
          alignItems="center"
        >
          <Icon as={BiHash} mr={2} color="gray.500" mt=".15rem" />
          <Stack spacing={1} direction="row" flexWrap="wrap">
            {recipe.tags?.map((tag: any) => {
              return (
                <Tag
                  _hover={{ shadow: "sm" }}
                  key={tag.tagId + CreateRandomID(6)}
                  mt={1}
                  size="sm"
                >
                  <Link href={`/explore?tag=${tag?.name}`}>
                    <a>{tag?.name}</a>
                  </Link>
                </Tag>
              );
            })}
          </Stack>
        </Box>
        <Box mt={3}>
          <LikesAndComments {...recipe} />
        </Box>
      </Box>
    </Box>
  );
}
