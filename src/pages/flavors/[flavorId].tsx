import { useRouter } from "next/router";
import { useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "../../client/firebaseHelpers";
import Link from "next/link";

import { Avatar, Box, Text, Button, Stack, Icon, Tag } from "@chakra-ui/core";
import { RecipeCard } from "../../client/components/RecipeCard/RecipeCard.component";
import {GetRecipes} from "../../client/components/GetRecipes/GetRecipes.component";
// import { USER_RECIPES } from "../../client/gql/recipes";
import { FLAVOR_QUERY } from "../../client/gql/flavors";
import BackBar from "../../client/components/BackBar/BackBar.component";

import {
  BiHash,
} from "react-icons/bi";
import { CreateRandomID } from "../../helpers/CreateRandomId";

const FlavorData = () => {
  const router = useRouter();
  const flavorId = router.query.flavorId;

  const flavor = useQuery(FLAVOR_QUERY, {
    variables: {
      flavorId: flavorId,
    },
    onCompleted: (res) => {
      console.log(res);
    },
    onError: (err) => {
      console.error(err);
    },
  });
{

}
  return (
    <Box>
      {flavor.data && !flavor.loading && !flavor.error && (
        <Box>
          <Box mb={4}>
            <Text as="h2" fontSize="xl" fontWeight="semibold">
              {flavor.data.Flavor[0].name}
            </Text>
            <Text>{flavor.data.Flavor[0].description}</Text>
          </Box>
          <Box mb={4}>
            <Text>
              Company:[name, avatar, description, website, address, etc]
            </Text>
          </Box>
          <Box
            className="flavor__tags"
            mt={1}
            d="flex"
            flexDir="row"
            alignItems="center"
          >
            <Icon as={BiHash} mr={2} color="gray.500" mt=".15rem" />
            <Stack spacing={1} direction="row" flexWrap="wrap">
              {flavor.data.Flavor[0].tags?.map((tag: any) => {
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
        </Box>
      )}
    </Box>
  );
};

const FlavorPage = () => {
  const router = useRouter();
  const flavorId = router.query.flavorId;
  
  let filter = { ingredients_single: { Flavor: { flavorId: flavorId } } };

  return (
    <Box w="500px" maxW="100%">
      <BackBar title="Flavor" />
      <Box
        display="flex"
        w="100%"
        flexDir="column"
        bg="white"
        rounded="lg"
        shadow="md"
        p={4}
      >
        <Box w="500px" maxW="100%" mt={4} mb={4}>
          <FlavorData />
        </Box>
      </Box>

      <Box w="500px" maxW="100%" mt={4} mb={4}>
        <GetRecipes {...filter} />
      </Box>
    </Box>
  );
};

export default FlavorPage;
