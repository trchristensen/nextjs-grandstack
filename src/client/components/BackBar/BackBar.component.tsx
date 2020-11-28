import { useRouter } from "next/router";
import { Box, Button, Icon } from "@chakra-ui/core";
import { BiArrowBack } from "react-icons/bi";


interface MyProps {}

const BackBar : React.FC<MyProps> = props => {
  const router = useRouter();

  return (
    <Box
      d="flex"
      alignItems="center"
      justifyContent="space-between"
      color="gray.600"
      bg="white"
      mb={4}
      py={1}
      px={2}
      rounded="lg"
      shadow="sm"
    >
      <Button
        onClick={() => router.back()}
        p={0}
        rounded="full"
        transition="all 0.2s"
        bg="none"
        color="gray.500"
        _hover={{ bg: "gray.100", shadow: "sm" }}
        _expanded={{ bg: "red.200" }}
        _focus={{ outline: 0, boxShadow: "none" }}
      >
        <Icon width={5} height={5} as={BiArrowBack} />
      </Button>
      <Box>{props.children}</Box>
    </Box>
  );
};

export default BackBar;