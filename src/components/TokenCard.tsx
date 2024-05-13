import {
  Box,
  Button,
  Text,
  Image,
  Link,
  VStack,
  HStack,
  Flex,
} from "@chakra-ui/react";
import TokenManageCard from "./TokenManageCard";
import UnknownIcon from "../assets/unknown.png";
import LinkIcon from "../assets/link.svg";
import BurnIcon from "../assets/burn.svg";

const TokenCard = ({
  imageUrl,
  tokenName,
  tokenSymbol,
  tokenUrl,
  tokenAddress,
  amount,
  price,
  selected,
  freezeAuthority,
  mintAuthority,
  immutable,
  handleSelect,
}) => {
  const shortenString = (address: string): string => {
    if (address.length <= 8) {
      return address;
    } else {
      const firstPart = address.substring(0, 4);
      const lastPart = address.substring(address.length - 4);
      return firstPart + "..." + lastPart;
    }
  };
  return (
    <Box
      borderRadius="md"
      py={4}
      px={5}
      bg="#282828"
      color={selected ? "#FF7D7B" : "white"}
      textAlign="center"
      fontFamily={"Arial"}
      minWidth={"200px"}
      position={"relative"}
    >
      <VStack spacing={1}>
        <Box
          width={"150px"}
          height={"150px"}
          borderRadius={"50%"}
          overflow={"hidden"}
        >
          <Image
            width={"100%"}
            height={"100%"}
            objectFit={"cover"}
            src={imageUrl ? imageUrl : UnknownIcon}
            alt={`${tokenName} Logo`}
          />
        </Box>

        <Text
          fontSize="24px"
          fontWeight="bold"
          whiteSpace={"nowrap"}
          width={"100%"}
          overflow={"hidden"}
          textOverflow={"ellipsis"}
        >
          {tokenName ? tokenName : "Unknown"}
        </Text>
        <Flex align={"center"}>
          <Text fontSize="sm" fontWeight="bold" paddingX={"10px"}>
            {tokenSymbol ? tokenSymbol : "Unknown"}
          </Text>
          <Link
            href={tokenUrl}
            isExternal
            color={selected ? "#FF7D7B" : "#BB2ADD"}
            display={"flex"}
            alignItems={"center"}
          >
            {shortenString(tokenAddress)}
            <Image
              width={"100%"}
              height={"100%"}
              marginLeft={"4px"}
              src={LinkIcon}
            />
          </Link>
        </Flex>

        <Text fontSize="xl" fontWeight="bold">
          {amount} {tokenSymbol}
        </Text>
        <Text fontSize="sm" color="gray.400">
          ${price}
        </Text>

        {selected ? (
          <HStack spacing={10}>
            <Button
              bg="#FF7D7B"
              borderRadius={"full"}
              paddingX={"20px"}
              onClick={() => handleSelect(false)}
            >
              DESELECT
            </Button>
          </HStack>
        ) : (
          <HStack>
            <TokenManageCard
              imageUrl={imageUrl}
              tokenName={tokenName}
              freezeAuthority={freezeAuthority}
              mintAuthority={mintAuthority}
              immutable={immutable}
            ></TokenManageCard>
            <Button
              bg="#FF7D7B"
              borderRadius={"full"}
              color={"#2D1A38"}
              onClick={() => handleSelect(true)}
              paddingX={"20px"}
            >
              BURN
            </Button>
          </HStack>
        )}
      </VStack>
      {selected && (
        <Image
          position={"absolute"}
          top="10px"
          right="10px"
          width={"40px"}
          objectFit={"cover"}
          src={BurnIcon}
        />
      )}
    </Box>
  );
};

export default TokenCard;
