import React from "react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "../../../client/firebaseHelpers";
// import { Recipe } from "../../gen/index";
import {
  RECIPES_QUERY,
  UPDATE_RECIPE_RATING,
  CREATE_RECIPE_COMMENT,
} from "../../gql/recipes";
import {
  Avatar,
  Box,
  useToast,
  Button,
  Icon,
  Textarea,
  FormControl,
  Input,
  Text,
} from "@chakra-ui/core";
import { BiLike, BiDislike } from "react-icons/bi";
import { CreateRandomID } from "../../../helpers/CreateRandomId";
import { formatDistanceToNow } from "date-fns";

export const AddComment = (recipe: any) => {
  const toast = useToast();
  const [userAuth, userAuthLoading] = useAuthState(getAuth());

  const [comment, setComment] = React.useState<string>("");

  const [createComment] = useMutation(CREATE_RECIPE_COMMENT, {
    refetchQueries: [
      {
        query: RECIPES_QUERY,
        variables: { orderBy: "published_desc", isArchived: false },
      },
    ],
    onCompleted: (res) => {
      console.log(res);
      setComment("");
      toast({
        title: "Success",
        description: `Comment has been added!`,
        status: "success",
        position: "bottom-right",
        duration: 8000,
        isClosable: true,
      });
    },
    onError: (err) => {
      console.error(err);
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

  const handleAddComment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let commentPayload = {
      variables: {
        published: new Date().toISOString(),
        commentId: CreateRandomID(32),
        recipeId: recipe.recipeId,
        userId: userAuth?.uid,
        text: comment,
      },
    };
    console.log(commentPayload);

    createComment(commentPayload);
  };

  return (
    <Box w="full">
      <form onSubmit={(event) => handleAddComment(event)}>
        <FormControl>
          <Input
            rounded="full"
            value={comment}
            onChange={(ev: React.ChangeEvent<HTMLInputElement>): void =>
              setComment(ev.target.value)
            }
            w="full"
            placeholder="Say something."
          />
        </FormControl>
      </form>
    </Box>
  );
};

export const CommentBox = (recipe: any) => {
  return (
    <Box
      borderTopWidth={1}
      mt={2}
      pt={2}
      d="flex"
      minWidth="70px"
      w="full"
      flexDir="column"
      // shadow="sm"
    >
      <AddComment {...recipe} />
      <Box mt={4}>
        {recipe?.comments.map((comment: any) => {
          return (
            <Box w="full" d="flex" flexDir="column">
              <Box d="flex" alignItems="center" justifyContent="flex-start">
                <Avatar size="xs" src={comment.author.avatar} mr={2} />
                <Box d="flex" flexDir="column" flexWrap="wrap">
                  <Box bg="gray.200" borderRadius="lg" px={2} py={1}>
                    <Text fontSize="sm" lineHeight="tight">
                      {comment.author.name}
                    </Text>
                    <Text fontSize="sm" lineHeight="tight">
                      {comment.text}
                    </Text>
                  </Box>

                  <Text fontSize="sm">
                    {formatDistanceToNow(
                      //@ts-ignore
                      new Date(comment.published)
                    )}
                  </Text>
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default CommentBox;
