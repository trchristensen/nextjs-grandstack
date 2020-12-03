import React from 'react';
import {
  Avatar,
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Textarea,
  useToast,
  SliderTrack,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  Flex,
  Text,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/core";
import gql from "graphql-tag";
import { CreateRandomID } from "../../../helpers/CreateRandomId";
import { getAuth } from "../../../client/firebaseHelpers";
import { useAuthState } from "react-firebase-hooks/auth";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { RECIPES_QUERY } from "../../gql/recipes";

import FlavorRow from '../FlavorRow/FlavorRow.component'
import { parse } from 'path';

const FLAVORS = gql`
  query Flavors {
    Flavor {
      name
      flavorId
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
    $steepTime: Int
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
      steepTime: $steepTime
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
  const [flavorList, setFlavorList] = React.useState<any[]>();
  const [selectedOption, setSelectedOption] = React.useState<any>();
  const [submittable, setSubmittable] = React.useState(false);
  const [mixingPercentage, setMixingPercentage] = React.useState<number>(12);
  const [steepTime, setSteepTime] = React.useState<number>(0);
  const [notes, setNotes] = React.useState<string>("");
  const [tags, setTags] = React.useState<any[]>();
  const [flavorTotal, setFlavorTotal] = React.useState<number>(0);
  const [createForm, setCreateForm] = React.useState(false);

  type Iingredient = {
    ml?: Number;
    grams?: Number;
    drops?: Number;
    percentage?: Number;
    flavorId: String;
  }
  const [ingredients, setIngredients] = React.useState<Iingredient[]>([])

  const TagOptions = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];

  const handleTags = (newValue: any, actionMeta: any) => {
    setTags(newValue);
  };

  // React.useEffect(() => {
  //   console.log("tags", tags);
  // }, [tags]);

  const handleTagsInputChange = (inputValue: any, actionMeta: any) => {};

  const handleChange = (selectedOption: any) => {
    setSelectedOption([...selectedOption]);
    // set ingredients to remove anything thats not in selected option.

    const s = ingredients.filter(
      (ingredient) => selectedOption.find(({ value }) => ingredient.flavorId === value)
    );
    setIngredients(s)
    
  };

  const handleMixingPercentageChange = (mixingPercentage: any) => {
    setMixingPercentage(mixingPercentage);
  };

  const handleupdateTotal = (e) => {
      console.log('flavorObject', e)
      console.log('ingredientsObject', ingredients)
      console.log('selectedOption', selectedOption)

      // check if ingredient is in selectedOptions.
      var filterOptionArray = selectedOption.filter((flavor) => (flavor.value == e.flavorId));
      console.log("filterOptionArray", filterOptionArray)

      // if not, then remove. and return.
      if ( !filterOptionArray) {
        setIngredients(selectedOption.filter((flavor) => (flavor.value != e.flavorId)))
        console.log('ingredient is not in selected option')
      }
      else {
        console.log('ingredient is in selected option')
        // if the ingredients array does not cont`ain the flavor with updated measurement values,
        var filterArray = ingredients.filter((flavor) => (flavor.flavorId == e.flavorId));

        if (!filterArray) {
          console.log('ingredient is NOT in ingredients already')
          setIngredients(selectedOption.filter((flavor) => (flavor.value != e.flavorId)))
        }
        
        console.log('setting ingredients')
        setIngredients([
            ...ingredients,
            e
          ])
      }
  };


  const Flavors = useQuery(FLAVORS);

  React.useEffect(() => {
    var result = Flavors.data?.Flavor.map((flavor: any) => ({
      value: flavor.flavorId,
      label: flavor.name,
    }));

    setFlavorList(result);
    // console.log(result);
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

  let filter = {};
  const router = useRouter();
  const tag = router.query.tag;
  const q = router.query.q;

  if (tag) {
    filter = {
      ...filter,
      tags_single: { name_contains: tag },
    };
  }
  if (q) {
    filter = {
      ...filter,
      name_contains: q,
    };
  }

  const [CreateRecipeWithIngredients] = useMutation(CREATE_RECIPE_MUTATION, {
    refetchQueries: [
      {
        query: RECIPES_QUERY,
        variables: {
          isArchived: false,
          orderBy: "published_desc",
          first: 20,
          offset: 0,
          filter: filter,
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
    if (ingredients === null) return;

        let ingredientsPayload = [];

        selectedOption.map((option: any) => {
          let grams = (document.getElementById(
            `${option.value}-grams`
          ) as HTMLInputElement).value;
          let drops = 20 * parseInt(grams);
          let percentage = 0;
          let flavorId = option.value;

          ingredientsPayload.push({
            grams: parseInt(grams),
            ml: parseInt(grams),
            drops: parseInt(drops),
            percentage: parseInt(percentage),
            flavorId: flavorId,
          });
        });

    //@ts-ignore
    const tagsFormatted = tags?.map((t: any) => {
      return { tagId: t.value, name: t.label };
    });

    const RecipePayload = {
      variables: {
        userId: `${user?.uid}`,
        recipeId: CreateRandomID(32),
        name: `${name}`,
        description: `${description}`,
        published: currentDateTime,
        isArchived: false,
        ingredients: ingredientsPayload,
        notes: `${notes}`,
        mixingPercentage: mixingPercentage,
        steepTime: steepTime,
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
              mr={4}
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
          <FormLabel as="legend">Suggested Steep Time (Days)</FormLabel>
          <Flex>
            <NumberInput
              defaultValue={0}
              min={0}
              max={30}
              maxW="100px"
              mr="2rem"
              value={steepTime}
              onChange={(e) => setSteepTime(e)}
            />
            <Slider
              flex="1"
              value={steepTime}
              onChange={(e) => setSteepTime(e)}
              defaultValue={12}
              min={1}
              max={30}
              mr={4}
            >
              <SliderTrack />
              <SliderFilledTrack />
              <SliderThumb
                fontSize="sm"
                width="32px"
                height="20px"
                children={steepTime}
              />
            </Slider>
          </Flex>
        </FormControl>
        <FormControl mb={3}>
          <FormLabel>Choose Flavors</FormLabel>
          <Select
            value={selectedOption}
            required
            isMulti
            name="flavors"
            options={flavorList}
            // closeMenuOnSelect={false}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={handleChange}
            isClearable={true}
          />
          {selectedOption &&
            selectedOption.map((row: any) => (
              <FlavorRow
                key={row.value}
                {...row}
                handleupdateTotal={handleupdateTotal}
              />

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
      {JSON.stringify(ingredients)}
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
