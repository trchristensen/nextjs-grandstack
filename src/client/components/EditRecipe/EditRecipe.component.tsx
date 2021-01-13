import React from "react";
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
  NumberInput,
} from "@chakra-ui/core";
import { CreateRandomID } from "../../../helpers/CreateRandomId";
import { getAuth } from "../../../client/firebaseHelpers";
import { useAuthState } from "react-firebase-hooks/auth";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { RECIPES_QUERY, UPDATE_RECIPE } from "../../gql/recipes";
import { FLAVORS } from "../../gql/flavors";
import FlavorRow from "../FlavorRow/FlavorRow.component";

const EditRecipe = () => {
  //  url filter params
  const router = useRouter();
  const recipeId = router.query.recipeId;

  let filter = {
    recipeId: recipeId,
  };

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
  const [
    flavorTotalPercentage,
    setFlavorTotalPercentage,
  ] = React.useState<number>(0);
  const [createForm, setCreateForm] = React.useState(false);

  type Iingredient = {
    percentage?: Number;
    flavorId: String;
  };
  const [ingredients, setIngredients] = React.useState<Iingredient[]>([]);

  const TagOptions = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];

  const handleTags = (newValue: any, actionMeta: any) => {
    setTags(newValue);
  };

  const handleTagsInputChange = (inputValue: any, actionMeta: any) => {};

  const handleMixingPercentageChange = (mixingPercentage: any) => {
    setMixingPercentage(mixingPercentage);
  };

  const handleChange = (selectedOption: any) => {
    setSelectedOption([...selectedOption]);

    const s = ingredients.filter((ingredient) =>
      selectedOption.find(({ value }: any) => ingredient.flavorId === value)
    );
    setIngredients(s);
  };

  const handleupdateTotal = (ingredientObject: any) => {
    const isIngredientInTheSelectedOptionState = selectedOption.filter(
      (flavor: any) => flavor.value == ingredientObject.flavorId
    );

    const ingredientListWithoutUpdatedIngredient = ingredients.filter(
      (ingredient) => {
        return ingredient.flavorId !== ingredientObject.flavorId;
      }
    );

    const totalPercent =
      ingredientListWithoutUpdatedIngredient.reduce(function (prev, cur) {
        //@ts-ignore
        return prev + cur.percentage;
      }, 0) + ingredientObject.percentage;

    setFlavorTotalPercentage(totalPercent);

    console.log("total percent", totalPercent);

    setIngredients([
      ...ingredientListWithoutUpdatedIngredient,
      ingredientObject,
    ]);
  };

  const Flavors = useQuery(FLAVORS);

  React.useEffect(() => {
    var result = Flavors.data?.Flavor.map((flavor: any) => ({
      value: flavor.flavorId,
      label: flavor.name,
    }));
    setFlavorList(result);
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

  const [UpdateRecipeWithIngredients] = useMutation(UPDATE_RECIPE, {
    refetchQueries: [
      {
        query: RECIPES_QUERY,
        variables: {
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
        description: "Recipe has been updated!",
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

  const recipe = useQuery(RECIPES_QUERY, {
    variables: {
      filter: filter,
    },
  });

  React.useEffect(() => {
    if (recipe.data) {
      console.log(recipe.data.Recipe[0]);
      setName(recipe.data.Recipe[0].name);
      setDescription(recipe.data.Recipe[0].description);
      setNotes(recipe.data.Recipe[0].notes);
      setMixingPercentage(recipe.data.Recipe[0].mixingPercentage);
      setSteepTime(recipe.data.Recipe[0].steepTime);
      setSelectedOption(
        recipe.data.Recipe[0].ingredients.map((ingredient: any) => {
          return {
            label: ingredient.Flavor.name,
            value: ingredient.Flavor.flavorId,
            percent: ingredient.percentage,
          };
        })
      );
      setIngredients(
        recipe.data.Recipe[0].ingredients.map((ingredient: any) => {
          return {
            flavorId: ingredient.Flavor.flavorId,
            percentage: ingredient.percentage,
          };
        })
      );
      setTags(
        recipe.data.Recipe[0].tags.map((tag: any) => {
          return {
            label: tag.name,
            value: tag.tagId,
          };
        })
      );
    }
  }, [recipe.data]);

  const handleCreateRecipe = (e: any) => {
    e.preventDefault();
    setSubmittable(false);

    const currentDateTime = new Date().toISOString();
    if (ingredients === null) return;

    const tagsFormatted = tags?.map((t: any) => {
      return { tagId: t.value, name: t.label };
    });

    const RecipePayload = {
      variables: {
        id: recipeId,
        userId: `${user?.uid}`,
        recipeId: recipeId,
        name: `${name}`,
        description: `${description}`,
        published: currentDateTime,
        isArchived: false,
        ingredients: ingredients,
        notes: `${notes}`,
        mixingPercentage: mixingPercentage,
        steepTime: steepTime,
        tags: tagsFormatted,
        parent: null
      },
    };

    UpdateRecipeWithIngredients(RecipePayload);
  };

  return (
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
            Edit Recipe
          </Text>
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
              onChange={(e: any) => setSteepTime(e)}
            />
            <Slider
              flex="1"
              value={steepTime}
              onChange={(e: any) => setSteepTime(e)}
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
                percent={row.percent}
                flavorTotalPercentage={flavorTotalPercentage}
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
            value={tags}
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
  );
};

export default EditRecipe;
