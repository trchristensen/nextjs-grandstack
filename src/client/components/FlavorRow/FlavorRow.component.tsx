import React from "react";
import {
  Box,
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/core";

const FlavorRow = ({ handleupdateTotal, ...row }: any) => {

const [grams, setGrams] = React.useState()
const [ml, setMl] = React.useState();

const handleInputChange = (e:any) => {
  setGrams(e)
  setMl(e)
  // setDrops(e * 20)
  // setPercentage()
  handleupdateTotal();
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
        mr={2}
        marginBottom={0}
        fontWeight="medium"
      >
        {row.label}
      </Box>
      <Box d="flex" justifyContent="flex-end">
        <Box display="flex" alignItems="center">
          <NumberInput
            // onChange={handleupdateTotal}
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
              handleInputChange(e)
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
          <FormLabel marginLeft={2}>ml</FormLabel>
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
              handleInputChange(e)
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
          <FormLabel marginLeft={2}>g</FormLabel>
        </Box>
      </Box>
    </Box>
  );
};

export default FlavorRow;