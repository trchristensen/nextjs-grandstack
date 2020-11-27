import React from "react";
import {
  Avatar,
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
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
  SliderTrack,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  Flex,
  Text
} from "@chakra-ui/core";
// import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { CreateRandomID } from "../../../helpers/CreateRandomId";
import { getAuth } from "../../../client/firebaseHelpers";
import { useAuthState } from "react-firebase-hooks/auth";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";

import {
  useCreateRecipeWithIngredientsMutation,
  Flavor,
} from "../../gen/index";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { setTimeout } from "timers";

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
      numComments
    }
  }
`;

const CREATE_RECIPE_MUTATION = gql`
  mutation createRecipeWithIngredientsAndTags(
    $userId: String!
    $recipeId: ID!
    $name: String!
    $description: String!
    $published: String!
    $isArchived: Boolean!
    $ingredients: [CustomIngredientsInput]
    $notes: String
    $mixingPercentage: Int
    $tags: [CustomTagsInput]
  ) {
    createRecipeWithIngredientsAndTags(
      userId: $userId
      recipeId: $recipeId
      name: $name
      description: $description
      published: $published
      isArchived: $isArchived
      ingredients: $ingredients
      notes: $notes
      mixingPercentage: $mixingPercentage
      tags: $tags
    ) {
      name
      recipeId
    }
  }
`;

export function CreateRecipe() {
  const toast = useToast();
  const [user] = useAuthState(getAuth());
  const [name, setName] = React.useState<string>("");
  const [description, setDescription] = React.useState<string>("");
  const [flavorList, setFlavorList] = React.useState<Flavor[]>();
  const [selectedOption, setSelectedOption] = React.useState<any>();
  const [measurement, setMeasurement] = React.useState<string>("g");
  const [submittable, setSubmittable] = React.useState(false);
  const [mixingPercentage, setMixingPercentage] = React.useState<number>(12);
  const [notes, setNotes] = React.useState<string>("");
  const [tags, setTags] = React.useState<any[]>()

  const [flavorTotal, setFlavorTotal] = React.useState<number>(0);

  const [createForm, setCreateForm] = React.useState(false);

  const TagOptions = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];

  const handleTags = (newValue: any, actionMeta: any) => {
    setTags(newValue)
  };

  React.useEffect(() => {
    console.log('woo',tags)
  }, [tags])

  const handleTagsInputChange = (inputValue: any, actionMeta: any) => {
    // console.group("Input Changed");
    // console.log(inputValue);
    // console.log(`action: ${actionMeta.action}`);
    // console.groupEnd();
  };

  const handleChange = (selectedOption: any) => {
    setSelectedOption([...selectedOption]);
  };

  const handleMixingPercentageChange = (mixingPercentage: any) => {
    setMixingPercentage(mixingPercentage);
  };

  const handleupdateTotal = () => {
     const qty = [...document.getElementsByClassName('flavorQty__input') as HTMLCollectionOf<HTMLInputElement>];
    

     let total = 0;
     const flavorTotalArray:any = qty.map((element:any) => {
       if (parseInt(element.value) === NaN) return;
      return total = total + parseInt(element.value);
     })

     console.log(total)
    //  console.log(CheckTotalFlavorAmount(flavorTotalArray, "g"))
    // if flavorTotalArray.reduce() == 100
  }

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
    if (name.length && description.length && selectedOption != null) {
      if (submittable === false) {
        setSubmittable(true);
      }
    } else if (submittable === true) {
      setSubmittable(false);
    }
  }, [name, description, selectedOption]);

  const [CreateRecipeWithIngredients] = useMutation(CREATE_RECIPE_MUTATION,{
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
      setNotes("");
      setSelectedOption(null);
      setSubmittable(true);
      setCreateForm(false);
      toast({
        title: "Success",
        description: "Recipe has been created!",
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

  const handleCreateRecipe = (e: any) => {
    e.preventDefault();
    setSubmittable(false);

    const currentDateTime = new Date().toISOString();

    const recipeInfo = selectedOption;
    if (recipeInfo === null) return;

    const newFlavorInfo: any = recipeInfo.map((flavor: any) => {
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
    //@ts-ignore
    const tagsFormatted = tags?.map((t:any) => {
      return ({tagId: t.value, name: t.label})
    })

    const RecipePayload = {
      variables: {
        userId: `${user?.uid}`,
        recipeId: CreateRandomID(32),
        name: `${name}`,
        description: `${description}`,
        published: currentDateTime,
        isArchived: false,
        ingredients: newFlavorInfo,
        notes: `${notes}`,
        mixingPercentage: mixingPercentage,
        tags: tagsFormatted,
      },
    };

    console.log(console.log("Recipe Payload", RecipePayload));
    CreateRecipeWithIngredients(RecipePayload);
  };

  return createForm ? (
    <Box
      marginY="1em"
      bg="white"
      p={6}
      rounded="lg"
      shadow="md"
      w="500px"
      maxW="100%"
    >
      <Box
        className="createRecipe__header"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={5}
        w="100%"
      >
        <Box>
          <Text as="h3" fontSize="lg" fontWeight="bold" mb={0}>
            Create Recipe
          </Text>
        </Box>
        <Box>
          <Button
            color="gray.500"
            rounded="full"
            p={0}
            onClick={() => setCreateForm(!createForm)}
          >
            X
          </Button>
        </Box>
      </Box>
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
          <Textarea
            placeholder="notes"
            value={notes}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNotes(e.target.value)
            }
          ></Textarea>
        </FormControl>
        <FormControl mb={3} as="fieldset">
          <FormLabel as="legend">Suggested Mixing %</FormLabel>
          <Flex>
            <NumberInput
              defaultValue={12}
              min={1}
              max={100}
              maxW="100px"
              mr="2rem"
              value={mixingPercentage}
              onChange={handleMixingPercentageChange}
            />
            <Slider
              flex="1"
              value={mixingPercentage}
              onChange={handleMixingPercentageChange}
              defaultValue={12}
              min={1}
              max={100}
            >
              <SliderTrack />
              <SliderFilledTrack />
              <SliderThumb
                fontSize="sm"
                width="32px"
                height="20px"
                children={mixingPercentage}
              />
            </Slider>
          </Flex>
        </FormControl>
        <FormControl mb={3} as="fieldset">
          <FormLabel as="legend">Flavor Unit of Measurement</FormLabel>
          <RadioGroup
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setMeasurement(e.target.value)
            }
            value={measurement}
            display="flex"
            flexWrap="wrap"
            justifyContent="normal"
            defaultValue="%"
          >
            <Radio px={2} pl={0} value="%">
              %
            </Radio>
            <Radio px={2} value="g">
              grams
            </Radio>
            <Radio px={2} value="ml">
              mL
            </Radio>
          </RadioGroup>
        </FormControl>
        <FormControl mb={3}>
          <FormLabel>Choose Flavors</FormLabel>
          <Select
            value={selectedOption}
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
          {selectedOption &&
            selectedOption.map((row: any) => (
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
                  <NumberInput
                    onChange={handleupdateTotal}
                    size="sm"
                    maxW="80px"
                    min={0}
                    step={0.01}
                    precision={2}
                    keepWithinRange={true}
                  >
                    <NumberInputField
                      isRequired
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
        <FormControl mb={3}>
          <FormLabel>Add Tags</FormLabel>
          <CreatableSelect
            isMulti
            isClearable
            placeholder="Choose popular Tags or Create your own..."
            onChange={handleTags}
            onInputChange={handleTagsInputChange}
            options={TagOptions}
          />
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
  ) : (
    <Flex justifyContent="center" alignItems="center">
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        p={4}
        bg="white"
        rounded="lg"
        shadow="md"
        w="500px"
        maxW="100%"
      >
        <Avatar
          mr={4}
          size="sm"
          name={`${user?.displayName}`}
          src={`${user?.photoURL}`}
        />
        <Button
          rounded="full"
          w="100%"
          onClick={() => setCreateForm(!createForm)}
        >
          Create Recipe
        </Button>
      </Box>
    </Flex>
  );
}
