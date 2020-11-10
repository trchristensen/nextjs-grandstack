import React from "react";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Radio,
  RadioGroup,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/core";
// import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { CreateRandomID } from "../../../helpers/CreateRandomId";
import { getAuth } from "../../../client/firebaseHelpers";
import { useAuthState } from "react-firebase-hooks/auth";
import Select from "react-select";

import {
  useCreateRecipeWithIngredientsMutation,
  Flavor,
} from "../../gen/index";
import { useQuery } from "@apollo/react-hooks";


const FLAVORS = gql`
  query Flavors {
    Flavor {
      name
      flavorId
    }
  }
`;

const RECIPES_NOT_ARCHIVED = gql`
  query recipesNotArchived(
    $first: Int
    $offset: Int
    $orderBy: [_RecipeOrdering]
  ) {
    recipesNotArchived(first: $first, offset: $offset, orderBy: $orderBy) {
      recipeId
      name
      description
      published
      lastEdited
      creator {
        id
      }
      parent {
        recipeId
        name
      }
      ingredients {
        amount
        measurement
        Flavor {
          flavorId
          name
        }
      }
      tags {
        name
        tagId
      }
    }
  }
`;

export function CreateRecipe() {
  const [user] = useAuthState(getAuth());
  const [name, setName] = React.useState<string>("");
  const [description, setDescription] = React.useState<string>("");
  const [flavorList, setFlavorList] = React.useState<Flavor[]>();
  const [selectedOption, setSelectedOption] = React.useState<any>();
  const [measurement, setMeasurement] = React.useState<string>("g");
  const [submittable, setSubmittable] = React.useState(false);


  const handleChange = (selectedOption: any) => {
    setSelectedOption({ selectedOption });
  };

  const Flavors = useQuery(FLAVORS);

  React.useEffect(() => {
    var result = Flavors.data?.Flavor.map((flavor: Flavor) => ({
      value: flavor.flavorId,
      label: flavor.name,
    }));

    setFlavorList(result);
    console.log(result);
  }, [Flavors.data]);


  // form validation
  React.useEffect(() => {
    if (
      name.length &&
      description.length
      
    ) {
      if (submittable === false) {
        setSubmittable(true);
      }
    } else if (submittable === true) {
      setSubmittable(false);
    }

    console.log(selectedOption)
    
  }, [
    name,
    description,
    selectedOption
  ])

  const [CreateRecipeWithIngredients] = useCreateRecipeWithIngredientsMutation({
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
      setName("");
      setDescription("");
      setSelectedOption(null);
      
      
 
    },
    onError: (err) => {
      console.error(err);
    },
  });

  const handleCreateRecipe = (e: any) => {
    e.preventDefault();
    const currentDateTime = new Date().toISOString();

    const recipeInfo = [...selectedOption.selectedOption];
    if (recipeInfo === null) return;

    const newFlavorInfo: any = recipeInfo.map((flavor) => {
      const qty = (document.getElementById(
        `${flavor.value}`
      ) as HTMLInputElement).value;

      let rObj: {
        amount?: number;
        measurement?: string;
        flavorId?: string;
      } = {};
      rObj["amount"] = parseInt(qty);
      rObj["measurement"] = measurement;
      rObj["flavorId"] = flavor.value;
      return rObj;
    });

    const RecipePayload = {
      variables: {
        userId: `${user?.uid}`,
        recipeId: CreateRandomID(32),
        name: `${name}`,
        description: `${description}`,
        published: currentDateTime,
        isArchived: false,
        ingredients: newFlavorInfo,
      },
    };

    console.log(console.log('Recipe Payload', RecipePayload));
    CreateRecipeWithIngredients(RecipePayload);
  };

  return (
    <Box w="500px" maxW="100%" marginX="auto" marginY="1em">
      <form onSubmit={(e: React.FormEvent) => handleCreateRecipe(e)}>
        <FormControl mb={3}>
          <Input
            isRequired
            name="name"
            placeholder="name"
            type="text"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
          />
        </FormControl>
        <FormControl mb={3}>
          <Input
            isRequired
            marginTop="1em"
            name="description"
            placeholder="description"
            type="text"
            value={description}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setDescription(e.target.value)
            }
          />
        </FormControl>
        <FormControl mb={3}>
          <Select
            required
            isMulti
            name="flavors"
            options={flavorList}
            closeMenuOnSelect={false}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={handleChange}
            isClearable={true}
          />
          {selectedOption?.selectedOption &&
            selectedOption?.selectedOption.map((row: any) => (
              <Box
                className="flavorQty"
                my={4}
                p={4}
                py={2}
                border={1}
                rounded="lg"
                bg="gray.200"
                display="flex"
                flexWrap="wrap"
                justifyContent="space-between"
                key={row.value}
              >
                <Box
                  mb={2}
                  display="flex"
                  alignItems="center"
                  mr={2}
                  marginBottom={0}
                  fontWeight="medium"
                >
                  {row.label}
                </Box>
                <Box display="flex" alignItems="center">
                  <NumberInput size="sm" maxW="70px">
                    <NumberInputField
                      className="flavorQty__input"
                      id={row.value}
                    />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <FormLabel marginLeft={2}>({measurement})</FormLabel>
                </Box>
              </Box>
            ))}
        </FormControl>
        <Button
          isDisabled={submittable ? false : true}
          type="submit"
          variantColor="green"
          marginTop="1em"
        >
          Create Recipe
        </Button>
      </form>
    </Box>
  );
}
