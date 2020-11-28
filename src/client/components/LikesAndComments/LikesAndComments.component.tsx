import {
  Avatar,
  Box,
  Text,
  Icon,
  Button
} from "@chakra-ui/core";
import {
  BiComment,
} from "react-icons/bi";
import LikeBox from './LikeBox.component';
import CommentBox from "./CommentBox.component";



const LikesAndComments = (recipe: any) => {

  return (
    <Box className="likesAndComments">
      <Box
        className="lac__statusBar"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box d="flex" alignItems="center" color="gray.600">
          {/* {recipe?.numComments > 0 && recipe?.numComments}{" "} */}
          <Button
            // ml={recipe?.numComments > 0 && 1}
            p={0}
            rounded="full"
            transition="all 0.2s"
            bg="none"
            color="gray.500"
            _hover={{ bg: "gray.100", shadow: "sm" }}
            _expanded={{ bg: "red.200" }}
            _focus={{ outline: 0, boxShadow: "none" }}
          >
            <Icon width={5} height={5} as={BiComment} />
          </Button>
        </Box>
        <Box className="likesAndDislikes" d="flex" flexDir="row">
          <LikeBox {...recipe} />
        </Box>
      </Box>
      <CommentBox {...recipe} />
    </Box>
  );
};

export default LikesAndComments;