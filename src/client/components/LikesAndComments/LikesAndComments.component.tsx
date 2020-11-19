import {
  Avatar,
  Box,
  Text,
} from "@chakra-ui/core";


export const LikesAndComments = () => {

  return(   
  <Box className="likesAndComments">
    <Box className="lac__statusBar" display="flex" justifyContent="space-between" alignItems="center">
      <Box>Likes</Box>
      <Box>Comments</Box>
    </Box>
  </Box>
  )
}