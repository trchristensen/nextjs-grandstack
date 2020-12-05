import React from "react";
import { useRouter } from "next/router";
import { Avatar, Box, Text, Icon, Button } from "@chakra-ui/core";
import { BiComment } from "react-icons/bi";
import LikeBox from "./LikeBox.component";
import CommentBox from "./CommentBox.component";
import { useLazyQuery } from "@apollo/react-hooks";
import { RECIPE_COMMENTS } from "../../gql/recipes";

const LikesAndComments = (recipe: any) => {
  const router = useRouter();
  const [showComments, setShowComments] = React.useState(false);

  React.useEffect(() => {
    if (router.pathname == "/recipes/[recipeId]") setShowComments(true) 
  }, [router])

  const handleShowComments = () => {
    setShowComments(!showComments)
    
  }

  return (
    <Box className="likesAndComments">
      <Box
        className="lac__statusBar"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box d="flex" alignItems="center" color="gray.600">
          {recipe?.numComments > 0 && recipe?.numComments}{" "}
          <Button
            onClick={handleShowComments}
            ml={`${recipe?.numComments > 0 && 1}`}
            p={0}
            rounded="full"
            transition="all 0.2s"
            bg="none"
            color="gray.500"
            _hover={{ bg: "gray.100", shadow: "sm" }}
            _expanded={{ bg: "gray.400" }}
            _focus={{ outline: 0, boxShadow: "none" }}
          >
            <Icon width={5} height={5} as={BiComment} />
          </Button>
        </Box>
        <Box className="likesAndDislikes" d="flex" flexDir="row">
          <LikeBox {...recipe} />
        </Box>
      </Box>
      {showComments && <CommentBox {...recipe} 
      />}
    </Box>
  );
};

export default LikesAndComments;
