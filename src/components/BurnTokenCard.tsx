import { Box, Text, Image, Flex, Input } from "@chakra-ui/react";

const BurnTokenCard = ({
  imageUrl,
  tokenName,
  amount,
  burnAmount,
  setBurnAmount,
}) => {
  return (
    <Flex
      direction="column"
      align="center"
      p={4}
      color="white"
      width="250px"
      alignItems={"left"}
    >
      <Flex alignItems={"center"}>
        <Box
          width={"80px"}
          height={"80px"}
          overflow={"hidden"}
          borderRadius={"50%"}
          mb={3}
        >
          <Image
            src={imageUrl}
            width={"100%"}
            height={"100%"}
            objectFit={"cover"}
          />
        </Box>
        <Box textAlign={"left"}>
          <Text fontSize="xl" fontWeight="bold">
            {tokenName}
          </Text>
          <Text fontSize="m" mb={4} color={"#AFAFAF"}>
            Balance: {amount}
          </Text>
        </Box>
      </Flex>

      <Input
        placeholder="Enter amount to burn"
        size="md"
        background="#2D2D2D"
        borderColor="gray.600"
        mt="1"
        _focus={{ borderColor: "blue.500" }}
        type="number"
        value={burnAmount}
        onChange={(e) =>
          setBurnAmount(e.target.value > amount ? amount : e.target.value)
        }
      />
    </Flex>
  );
};

export default BurnTokenCard;
