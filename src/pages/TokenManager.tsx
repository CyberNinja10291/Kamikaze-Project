import { useState, useEffect } from "react";
import { useToast, Container, SimpleGrid, Spinner } from "@chakra-ui/react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction } from "@solana/web3.js";
import {
  Box,
  Button,
  Input,
  Heading,
  Flex,
  InputGroup,
  InputLeftElement,
  Text,
  CloseButton,
} from "@chakra-ui/react";
import ProgressBar from "../components/ProgressBar";
import { SearchIcon, CheckCircleIcon, CloseIcon } from "@chakra-ui/icons";
import {
  TOKEN_PROGRAM_ID,
  AccountLayout,
  getMint,
  getAssociatedTokenAddress,
  createBurnCheckedInstruction,
} from "@solana/spl-token";
import { getAsset } from "../utils/getMetaData";
import TokenCard from "../components/TokenCard";
import BurnPanel from "../components/BurnPanel";
const TokenManager = () => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const toast = useToast();
  const [account, setAccount] = useState("");
  const [tokenList, setTokenList] = useState([]);
  const [searchWord, setSearchWord] = useState("");

  const showToast = (title, info, Icon, duration) => {
    toast({
      position: "bottom-right",
      duration: duration,
      isClosable: true,
      render: ({ onClose }) => (
        <Box
          alignItems="center"
          bg="#BB2ADD" // Custom background color
          color="white"
          borderRadius="md"
          boxShadow="md"
          width={"350px"}
        >
          <Box
            display={"flex"}
            width={"100%"}
            justifyContent={"space-around"}
            alignItems={"center"}
            paddingY={"10px"}
            minHeight={"60px"}
          >
            <Icon boxSize="6" mr="3"></Icon>
            <Box mr="5">
              <strong>{title}</strong>
              <Text fontSize="15px">{info}</Text>
            </Box>
            <CloseButton size="sm" onClick={onClose} />
          </Box>
          {Icon != Spinner && (
            <ProgressBar duration={duration} onClose={onClose} />
          )}
        </Box>
      ),
    });
  };
  useEffect(() => {
    console.log("connection", connection);
    if (wallet && wallet.connected) {
      if (wallet.publicKey.toBase58() != account) {
        setAccount(wallet.publicKey.toBase58());
        getTokens();
      }
    } else {
      setAccount("");
      setTokenList([]);
    }
  }, [wallet]);

  const getTokens = async () => {
    try {
      console.log("get TOkens");
      const tokenAccounts = await connection.getTokenAccountsByOwner(
        wallet.publicKey,
        {
          programId: TOKEN_PROGRAM_ID,
        }
      );
      const tokenAddresses = tokenAccounts.value.map((data) =>
        AccountLayout.decode(data.account.data).mint.toBase58()
      );
      const tokenAmounts = tokenAccounts.value.map((data) =>
        Number(AccountLayout.decode(data.account.data).amount)
      );
      console.log("tokenaddresses", tokenAddresses);
      const tokenDatas = await getAsset(tokenAddresses);
      console.log("tokenDatas", tokenDatas);
      if (tokenDatas.length == 0) return;
      const tokens = [];
      for (let i = 0; i < tokenDatas.length; i++) {
        const isMutable = tokenDatas[i].mutable;
        const metaData = tokenDatas[i].content.metadata;
        const tokenInfo = tokenDatas[i].token_info;
        const imageUrl = tokenDatas[i].content.links.image;
        tokens.push({
          token: tokenAddresses[i],
          amount: tokenAmounts[i],
          name: metaData.name,
          symbol: metaData.symbol,
          decimals: Number(tokenInfo.decimals),
          imageUrl,
          tokenUrl: "https://solscan.io/token/" + tokenAddresses[i],
          selected: false,
          burnAmount: 0,
          immutable: !isMutable,
          freezeAuthority: tokenInfo.freeze_authority == null,
          mintAuthority: tokenInfo.mint_authority == null,
        });
      }
      setTokenList(tokens);
    } catch (error) {
      console.log("error", error);
    }
  };

  const setBurnAmount = async (tokenAddress: string, burnAmount: number) => {
    setTokenList((tokenList) => {
      const updatedTokenInfoArray = tokenList.map((tokenInfo: any) => {
        if (tokenInfo.token === tokenAddress) {
          return { ...tokenInfo, ["burnAmount"]: burnAmount };
        }
        return tokenInfo;
      });
      return updatedTokenInfoArray;
    });
  };
  const burnTokens = async () => {
    try {
      const burnTokenList = tokenList.filter(
        (item: any) => item.selected == true
      );
      let transaction = new Transaction();
      for (let i = 0; i < burnTokenList.length; i++) {
        const account = await getAssociatedTokenAddress(
          new PublicKey(burnTokenList[i].token),
          wallet.publicKey
        );
        const mintInfo = await getMint(
          connection,
          new PublicKey(burnTokenList[i].token)
        );
        if (burnTokenList[i].burnAmount != 0) {
          transaction = transaction.add(
            createBurnCheckedInstruction(
              account, // PublicKey of Owner's Associated Token Account
              new PublicKey(burnTokenList[i].token), // Public Key of the Token Mint Address
              wallet.publicKey, // Public Key of Owner's Wallet
              burnTokenList[i].burnAmount * 10 ** mintInfo.decimals, // Number of tokens to burn
              mintInfo.decimals // Number of Decimals of the Token Mint
            )
          );
        }
      }
      if (transaction.instructions.length != 0) {
        showToast("Confirming Transaction", "", Spinner, null);
        await wallet.sendTransaction(transaction, connection, {
          signers: [],
        });
        toast.closeAll();
        for (let i = 0; i < burnTokenList.length; i++) {
          if (burnTokenList[i].burnAmount != 0) {
            showToast(
              "Burn Successful",
              burnTokenList[i].burnAmount + burnTokenList[i].symbol + "BURNED",
              CheckCircleIcon,
              5000
            );
          }
        }
        getTokens();
      } else {
        showToast("No selected Token", "", CloseIcon, 5000);
      }
    } catch (error) {
      toast.closeAll();
      showToast("Transaction Failed", "", CloseIcon, 5000);
    }
  };
  const selectToken = (tokenAddress: string, select: boolean) => {
    setTokenList((tokenList) => {
      // Make a copy of the array
      const updatedTokenInfoArray = tokenList.map((tokenInfo: any) => {
        // Find the token info object with the matching id
        if (tokenInfo.token === tokenAddress) {
          // Update the specified property with the new value
          return { ...tokenInfo, ["selected"]: select };
        }
        return tokenInfo; // Return the unchanged token info object
      });
      return updatedTokenInfoArray; // Set the state with the updated array
    });
  };
  const selectTokens = (select: boolean) => {
    setTokenList((tokenList) => {
      // Make a copy of the array
      const updatedTokenInfoArray = tokenList.map((tokenInfo: any) => {
        return { ...tokenInfo, ["selected"]: select };
      });
      return updatedTokenInfoArray;
    });
  };
  return (
    <Container
      maxW={{ base: "100%", md: "100%" }}
      color="white"
      paddingRight="0px"
      paddingLeft="50px"
      marginTop="60px"
    >
      <Flex display={{ lg: "flex" }}>
        <Box fontFamily={"Arial"} width={"100%"} padding={"20px 20px"}>
          <Flex
            align={"left"}
            flexDirection={"column"}
            marginBottom="20px"
            color={"white"}
          >
            <Box>
              <Heading
                letterSpacing={"tighter"}
                fontFamily={"Arial"}
                textAlign={"left"}
              >
                Manage Tokens
              </Heading>
            </Box>
            <Flex
              marginTop="48px"
              justifyContent={"space-between"}
              display={{ md: "flex", base: "block" }}
            >
              <Flex>
                <Button
                  color={"white"}
                  borderRadius={"20px"}
                  bg={"#282828"}
                  marginRight={"10px"}
                  onClick={() => selectTokens(true)}
                >
                  Select All Tokens
                </Button>
                <Button
                  color={"white"}
                  borderRadius={"20px"}
                  bg={"#282828"}
                  onClick={() => selectTokens(false)}
                >
                  Deselect All Tokens
                </Button>
              </Flex>
              <Box>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <SearchIcon color="#494949" />
                  </InputLeftElement>
                  <Input
                    type="text"
                    placeholder="Search LP token address..."
                    borderRadius={"100px"}
                    width={"350px"}
                    bg="#2D2D2D"
                    border="0px"
                    onChange={(e) => setSearchWord(e.target.value)}
                  />
                </InputGroup>
              </Box>
            </Flex>
          </Flex>
          <SimpleGrid
            columns={{ base: 1, md: 3 }}
            spacing={8}
            marginBottom={"30px"}
          >
            {tokenList.map(
              (item, key) =>
                (searchWord == "" || item.token.includes(searchWord)) && (
                  <TokenCard
                    key={key}
                    tokenAddress={item.token}
                    imageUrl={item.imageUrl}
                    tokenName={item.name}
                    tokenSymbol={item.symbol}
                    tokenUrl={item.tokenUrl}
                    amount={item.amount / 10 ** item.decimals}
                    // price={getTokenPrice(item.token)}
                    price={"0.01"}
                    selected={item.selected}
                    freezeAuthority={item.freezeAuthority}
                    mintAuthority={item.mintAuthority}
                    immutable={item.immutable}
                    handleSelect={(option: boolean) => {
                      selectToken(item.token, option);
                    }}
                  />
                )
            )}
          </SimpleGrid>
        </Box>
        <BurnPanel
          tokenList={tokenList.filter((item: any) => item.selected == true)}
          burnTokens={burnTokens}
          setBurnAmount={setBurnAmount}
        />
      </Flex>
    </Container>
  );
};
export default TokenManager;
