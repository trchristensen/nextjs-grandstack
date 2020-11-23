import {
  Avatar,
  Box,
  Text,
  Icon,
} from "@chakra-ui/core";
import {
  BiComment,
} from "react-icons/bi";
import { Recipe } from "../../gen/index";
import { LikeBox } from './LikeBox.component';


export const LikesAndComments = (recipe: Recipe) => {
  return (
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
          <LikeBox {...recipe} />
        </Box>
      </Box>
    </Box>
  );
};