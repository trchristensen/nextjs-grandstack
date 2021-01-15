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

const FlavorRow = ({ flavorTotalPercentage, handleupdateTotal, percent=0, ...row }: any) => {
  const [grams, setGrams] = React.useState(0);
  const [ml, setMl] = React.useState(0);
  const [drops, setDrops] = React.useState(0);
  const [percentage, setPercentage] = React.useState(percent);

  const handleChange = (e: any) => {

    handleupdateTotal({
      flavorId: row.value,
      percentage: e,
    });

    setPercentage(e);
  };


  

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
        display="flex"
        alignItems="center"
        marginBottom={0}
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
            max={100}
            keepWithinRange={true}
            value={percentage}
            //@ts-ignore
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              //@ts-ignore
              handleChange(e)
            }
          >
            <NumberInputField
              isRequired
              className="flavorQty__input"
              //@ts-ignore
              id={`${row.value}-percentage`}
              value={percentage}
            />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <FormLabel fontSize="sm" marginLeft={1}>
            %
          </FormLabel>
        </Box>

        
      </Box>
    </Box>
  );
};

export default FlavorRow;
