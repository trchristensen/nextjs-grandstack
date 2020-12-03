import React from "react";
import {
  Box,
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text
} from "@chakra-ui/core";

const FlavorRow = ({ flavorTotalPercentage, handleupdateTotal, ...row }: any) => {
  const [grams, setGrams] = React.useState(0);
  const [ml, setMl] = React.useState(0);
  const [drops, setDrops] = React.useState(0);
  const [percentage, setPercentage] = React.useState(0);

  const handleGramsOrMlInputChange = (e: any) => {
    setGrams(e);
    setMl(e);
    setDrops(e * 20);
    const flavorPercentage = handleupdateTotal({
      flavorId: row.value,
      grams: e,
      ml: e,
      drops: e * 20,
      percentage: 100,
    });

    setPercentage(flavorPercentage);
  };

   const handleDropsInputChange = (e: any) => {
    setGrams(e / 20);
    setMl(e / 20);
    setDrops(e)

     handleupdateTotal({
      flavorId: row.value,
      grams: e / 20,
      ml: e / 20,
      drops: e,
      percentage: 100
    });
  }

  const handlePercentageInputChange = (e: any) => {
    // setGrams(e / 20);
    // setMl(e / 20);
    // setDrops(e)

    //  handleupdateTotal({
    //   flavorId: row.value,
    //   grams: e / 20,
    //   ml: e / 20,
    //   drops: e
    // });
  }

  

  return (
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
        w="full"
        marginBottom={2}
        fontWeight="medium"

      >
        {row.label}
      </Box>
      <Box d="flex" justifyContent="flex-end">
        <Box display="flex" alignItems="center">
          <NumberInput
            size="sm"
            maxW="80px"
            min={0}
            step={0.01}
            precision={2}
            keepWithinRange={true}
            id={`${row.value}-ml`}
            value={ml}
            //@ts-ignore
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              //@ts-ignore
              handleGramsOrMlInputChange(e)
            }
          >
            <NumberInputField
              isRequired
              className="flavorQty__input"
              //@ts-ignore
              id={`${row.value}-ml`}
              value={ml}
            />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <FormLabel fontSize="sm" marginLeft={1}>ml</FormLabel>
        </Box>
        <Box display="flex" alignItems="center">
          <NumberInput
            size="sm"
            maxW="80px"
            min={0}
            step={0.01}
            precision={2}
            keepWithinRange={true}
            value={grams}
            //@ts-ignore
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              //@ts-ignore
              handleGramsOrMlInputChange(e)
            }
          >
            <NumberInputField
              isRequired
              className="flavorQty__input"
              //@ts-ignore
              id={`${row.value}-grams`}
              value={grams}
            />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <FormLabel fontSize="sm" marginLeft={1}>g</FormLabel>
        </Box>

        <Box display="flex" alignItems="center">
          <NumberInput
            size="sm"
            maxW="80px"
            min={0}
            step={0.01}
            precision={2}
            keepWithinRange={true}
            value={drops}
            //@ts-ignore
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              //@ts-ignore
              handleDropsInputChange(e)
            }
          >
            <NumberInputField
              isRequired
              className="flavorQty__input"
              //@ts-ignore
              id={`${row.value}-drops`}
              value={drops}
            />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <FormLabel fontSize="sm" marginLeft={1}>drops</FormLabel>
        </Box>

          <Text>{percentage}%</Text>
      </Box>
    </Box>
  );
};

export default FlavorRow;
