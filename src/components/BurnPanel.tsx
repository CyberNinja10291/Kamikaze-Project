import { Box, Text, Image } from "@chakra-ui/react";
import BurnTokenCard from "./BurnTokenCard";
import burnSvg from "../assets/burn.svg";
import UnknownIcon from "../assets/unknown.png";
import Confirm from "./Confirm";

const BurnPanel = ({ tokenList, burnTokens, setBurnAmount }) => {
  return (
    <Box
      marginLeft={"auto"}
      width={{ base: "100%", lg: "400px" }}
      minHeight={"100vh"}
      bg="#282828"
    >
      {tokenList.length == 0 ? (
        <Box
          display={"flex"}
          alignItems={"center"}
          height={"auto"}
          position={"relative"}
          top={"40vh"}
          flexDirection={"column"}
        >
          <Image src={burnSvg}></Image>
          <Text color={"#606060"}>Select an asset to BURN</Text>
        </Box>
      ) : (
        <Box
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
          justifyContent={"space-between"}
          height={"100%"}
        >
          <Box marginTop={"35px"}>
            <Text fontSize={"x-large"} textAlign={"left"} padding={"16px"}>
              Burning
            </Text>
            {tokenList.map(
              (item: any, key) =>
                item.selected && (
                  <BurnTokenCard
                    key={key}
                    imageUrl={item.imageUrl ? item.imageUrl : UnknownIcon}
                    tokenName={item.name ? item.name : "Unknown"}
                    amount={item.amount / 10 ** item.decimals}
                    setBurnAmount={(burnAmount: number) =>
                      setBurnAmount(item.token, burnAmount)
                    }
                    burnAmount={item.burnAmount}
                  />
                )
            )}
          </Box>
          <Box width={"100%"}>
            <Box
              display={"flex"}
              width={"100%"}
              justifyContent={"space-around"}
              padding={"20px 0px"}
              borderY={"1px solid"}
              borderColor={"#777777"}
              marginBottom={"20px"}
            >
              <Text>Sol to be exchanged:</Text>
              <Text>0.00SOL</Text>
            </Box>
            <Confirm onConfrim={burnTokens}></Confirm>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default BurnPanel;
