import React from "react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "../../../client/firebaseHelpers";

import { Recipe } from "../../gen/index";
import { RECIPES_NOT_ARCHIVED, ADD_RECIPE_LIKE, REMOVE_RECIPE_LIKE } from "../../gql/recipes";

import {
  Box,
  useToast,
  Button,
  Icon
} from "@chakra-ui/core";
import {
  BiLike,
  BiDislike,
} from "react-icons/bi";

import { CreateRandomID } from "../../../helpers/CreateRandomId";


export const LikeBox = (recipe: Recipe) => {
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
      setNumLikes(recipe.likes.length);
      if (like.userId == userAuth?.uid) {
        setLiked(true);
      } else {
        setLiked(false);
      }
    });
  }, [recipe]);

  const handleLike = () => {
    console.log("clicked the fucking like button");

    if (
      recipe.likes.length == undefined ||
      recipe.likes.length == null ||
      recipe.likes.length == 0
    ) {
      addLike();
      setLiked(true);
      setNumLikes(numLikes + 1);
    } else {
      recipe.likes?.map((like: any) => {
        console.log("userauth id is contained in the recipe likes");

        if (!liked) {
          addLike();
          setLiked(true);
          setNumLikes(numLikes + 1);
        } else {
          removeLike();
          setLiked(false);
          setNumLikes(numLikes - 1);
        }
      });
    }
  };

  return (
    <Box d="flex" justifyContent="center" alignItems="center">
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
        minWidth="60px"
        w="auto"
        h="35px"
        d="flex"
        justifyContent="center"
        px={0}
        py={0}
      >
        <Box d="flex" justifyContent="center" alignItems="flex-end">
          <Box mr={1}>{numLikes}</Box>
          <Icon color={liked && `gray.500`} as={BiLike} size={5} />
        </Box>
      </Button>
    </Box>
  );
};
