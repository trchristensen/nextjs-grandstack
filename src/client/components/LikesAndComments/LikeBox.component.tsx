import React from "react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "../../../client/firebaseHelpers";

import { Recipe } from "../../gen/index";
import { RECIPES_NOT_ARCHIVED, UPDATE_RECIPE_RATING } from "../../gql/recipes";

import { Box, useToast, Button, Icon } from "@chakra-ui/core";
import { BiLike, BiDislike } from "react-icons/bi";

import { CreateRandomID } from "../../../helpers/CreateRandomId";

export const LikeBox = (recipe: Recipe) => {
  const toast = useToast();
  const [updateRating] = useMutation(UPDATE_RECIPE_RATING, {
    refetchQueries: [
      {
        query: RECIPES_NOT_ARCHIVED,
        variables: {
          orderBy: "published_desc",
        },
      },
    ],
    onCompleted: (res) => {
      console.log(res);
      // setLiked(liked);
      toast({
        title: "Success",
        description: `Recipe has been rated!`,
        status: "success",
        position: "bottom-right",
        duration: 8000,
        isClosable: true,
      });
    },
    onError: (err) => {
      console.error(err);
      // setRating(rating - 1);
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

  const [liked, setLiked] = React.useState<Boolean | null>();
  const [rating, setRating] = React.useState(0);
  const [userAuth, userAuthLoading] = useAuthState(getAuth());

  React.useEffect(() => {
    //@ts-ignore
    setRating(recipe.numLikes - recipe.numDislikes);

    // set user rating to liked variable.

  }, [recipe]);

  const handleRating = (userRating: any) => {
    if (
      (userRating.like === true && liked === true) ||
      (userRating.like === false && liked === false)
    ) {
      return;
    }

    let ratingPayload = {
      userId: userAuth?.uid,
      recipeId: recipe.recipeId,
      ratingId: CreateRandomID(32),
      timestamp: new Date().toISOString(),
    };

    updateRating({
      variables: { ...ratingPayload, ...userRating },
    });
    setLiked(!liked);
  };

  return (
    <Box
      d="flex"
      justifyContent="center"
      alignItems="center"
      minWidth="70px"
      w="auto"
      // h="35px"
      borderWidth={1}
      rounded="full"
    >
      <Button
        onClick={() => handleRating({ like: false })}
        transition="all 0.2s"
        // borderWidth="1px"
        color="gray.500"
        bg={liked == false ? `gray.100` : null}
        rounded="full"
        _hover={{ bg: "gray.100" }}
        _expanded={{ bg: "red.200" }}
        _focus={{ outline: 0, boxShadow: "outline" }}
        alignItems="center"
        d="flex"
        justifyContent="center"
        px={2}
        py={0}
      >
        <Icon color={liked && `gray.500`} as={BiDislike} size={5} />
      </Button>
      <Box mr={2} ml={2}>
        {rating}
      </Box>
      <Button
        onClick={() => handleRating({ like: true })}
        transition="all 0.2s"
        // borderWidth="1px"
        color="gray.500"
        bg={liked == true ? `gray.100` : null}
        rounded="full"
        _hover={{ bg: "gray.100" }}
        _expanded={{ bg: "red.200" }}
        _focus={{ outline: 0, boxShadow: "outline" }}
        alignItems="center"
        d="flex"
        justifyContent="center"
        px={2}
        py={0}
      >
        <Icon color={liked && `gray.500`} as={BiLike} size={5} />
      </Button>
    </Box>
  );
};
