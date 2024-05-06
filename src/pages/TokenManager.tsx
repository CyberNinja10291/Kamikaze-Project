import { useState, useEffect } from "react";
import { useToast, Container } from "@chakra-ui/react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction } from "@solana/web3.js";
import {
  DataV2,
  createUpdateMetadataAccountV2Instruction,
} from "@metaplex-foundation/mpl-token-metadata";

import { findMetadataPda } from "@metaplex-foundation/js";
import {
  Text,
  Box,
  Button,
  Select,
  Input,
  Heading,
  Flex,
} from "@chakra-ui/react";
import {
  TOKEN_PROGRAM_ID,
  AccountLayout,
  getMint,
  getAssociatedTokenAddress,
  createBurnCheckedInstruction,
} from "@solana/spl-token";
import { getAsset } from "../utils/getMetaData";
const TokenManager = () => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const toast = useToast();
  const [account, setAccount] = useState("");
  const [tokenList, setTokenList] = useState([]);
  const [selectedToken, setSelectedToken] = useState("");
  const [selectedTokenAmount, setSelectedTokenAmount] = useState(0);
  const [selectedTokenName, setSelectedTokenName] = useState("");
  const [selectedTokenSymbol, setSelectedTokenSymbol] = useState("");

  const [tokenName, setTokenName] = useState("");
  const [tokenSymol, setTokenSymol] = useState("");
  const [metadataUrl, setMetadataUrl] = useState("");
  const [burnAmount, setBurnAmount] = useState("");

  const NotifyMessage = (
    message: string,
    status: "success" | "error" | "warning" | "info" = "info"
  ) => {
    toast({
      title: "Notification",
      description: message,
      status: status, // Can be "success", "error", "warning", or "info"
      duration: 5000,
      isClosable: true,
      position: "top", // Can be any valid position
    });
  };
  useEffect(() => {
    if (wallet && wallet.connected) {
      if (wallet.publicKey.toBase58() != account) {
        setAccount(account);
        getTokens();
      }
    } else {
      setAccount("");
      setTokenList([]);
    }
  }, [wallet]);

  const selectTokenHanlder = async (token: string) => {
    setSelectedToken(token);
    const result = tokenList.find((item) => item.token == token);
    setSelectedTokenAmount(result.amount / 10 ** result.decimals);
    setSelectedTokenName(result.name);
    setSelectedTokenSymbol(result.symbol);
  };
  const getTokens = async () => {
    const tokenAccounts = await connection.getTokenAccountsByOwner(
      wallet.publicKey,
      {
        programId: TOKEN_PROGRAM_ID,
      }
    );
    console.log(tokenAccounts.value.length);
    const tokenAddresses = tokenAccounts.value.map((data) =>
      AccountLayout.decode(data.account.data).mint.toBase58()
    );
    console.log("tokenAddresses", tokenAddresses);
    const tokenDatas = await getAsset(tokenAddresses);
    console.log(tokenDatas);
    const tokens = [];
    for (let i = 0; i < tokenDatas.length; i++) {
      const isMutable = tokenDatas[i].mutable;
      const metaData = tokenDatas[i].content.metadata;
      const tokenInfo = tokenDatas[i].token_info;
      if (!isMutable) continue;
      tokens.push({
        token: tokenAddresses[i],
        amount: Number(tokenInfo.supply),
        name: metaData.name,
        symbol: metaData.symbol,
        decimals: Number(tokenInfo.decimals),
      });
    }
    setTokenList(tokens);
  };

  const update = async () => {
    if (!wallet || !wallet.connected) {
      NotifyMessage("Connect the Wallet", "warning");
      return;
    }
    if (!tokenName || !tokenSymol || !metadataUrl || !selectedToken) {
      console.log("Fill all fields");
      NotifyMessage("Fill the token info", "warning");
      return;
    }
    const from = wallet;

    const mint = new PublicKey(selectedToken);
    const metadataPDA = await findMetadataPda(mint);
    const tokenMetadata = {
      name: tokenName,
      symbol: tokenSymol,
      uri: metadataUrl,
      sellerFeeBasisPoints: 0,
      creators: null,
      collection: null,
      uses: null,
    } as DataV2;

    const updateMetadataTransaction = new Transaction().add(
      createUpdateMetadataAccountV2Instruction(
        {
          metadata: metadataPDA,
          updateAuthority: from.publicKey,
        },
        {
          updateMetadataAccountArgsV2: {
            data: tokenMetadata,
            updateAuthority: from.publicKey,
            primarySaleHappened: true,
            isMutable: false,
          },
        }
      )
    );

    try {
      await wallet.sendTransaction(updateMetadataTransaction, connection, {
        signers: [],
      });
      NotifyMessage("Successfully Updated!");
    } catch (error) {
      NotifyMessage("Failed");
      console.log("error", error.message);
    }
  };

  const burnTokens = async (token: string, amount: number) => {
    if (!wallet || !wallet.connected) {
      NotifyMessage("Connect the Wallet", "warning");
      return;
    }
    if (!burnAmount) {
      NotifyMessage("Fill the burn amount!", "warning");
      return;
    }
    const account = await getAssociatedTokenAddress(
      new PublicKey(token),
      wallet.publicKey
    );

    const mintInfo = await getMint(connection, new PublicKey(token));
    if (selectedTokenAmount < amount) {
      NotifyMessage("Burn amount exceeds balance");
      return;
    }
    const transaction = new Transaction().add(
      createBurnCheckedInstruction(
        account, // PublicKey of Owner's Associated Token Account
        new PublicKey(token), // Public Key of the Token Mint Address
        wallet.publicKey, // Public Key of Owner's Wallet
        amount * 10 ** mintInfo.decimals, // Number of tokens to burn
        mintInfo.decimals // Number of Decimals of the Token Mint
      )
    );

    await wallet.sendTransaction(transaction, connection, {
      signers: [],
    });

    setSelectedTokenAmount(selectedTokenAmount - amount);
    getTokens();
    NotifyMessage("Successfully Burned");
  };

  return (
    <Container maxW={{ base: "100%", md: "full" }} p={{ base: 2, md: 1 }}>
      <Box
        p={4}
        borderRadius="2xl"
        boxShadow="dark-lg"
        paddingX={"5%"}
        paddingBottom={"30px"}
      >
        <Flex
          as="nav"
          align="center"
          justify="space-between"
          wrap="wrap"
          paddingY="1.5"
          paddingX="6"
          boxShadow="sm"
          borderRadius="lg"
          marginBottom="20px"
        >
          <Flex align="center" mr={5}>
            <Heading as="h1" size="lg" letterSpacing={"tighter"}>
              Manage SPL token
            </Heading>
          </Flex>

          <Text fontSize="md" display={{ base: "none", md: "block" }}>
            Begin the seamless process of updating your SPL token's metadata to
            ensure that your token's information remains accurate and up to date
            with the latest details
          </Text>
        </Flex>
        <Flex flexDirection={"column"} gap={4}>
          <Select
            placeholder="Select Token"
            value={selectedToken}
            onChange={(e) => selectTokenHanlder(e.target.value)}
            variant="filled"
            color="purple.700"
          >
            {tokenList.map((item, key) => (
              <option value={item.token} key={key}>
                {item.token}
              </option>
            ))}
          </Select>
          <Input
            placeholder="Type your new token name"
            onChange={(e) => setTokenName(e.target.value)}
          ></Input>
          <Input
            placeholder="Type your new token symbol"
            onChange={(e) => setTokenSymol(e.target.value)}
          ></Input>
          <Input
            placeholder="Type your new meatdata Url"
            onChange={(e) => setMetadataUrl(e.target.value)}
          ></Input>
          <Button colorScheme="green" variant="solid" onClick={update}>
            Update
          </Button>
          <Text>Burn Tokens</Text>
          <Box display={"flex"} justifyContent={"space-evenly"}>
            <Text fontSize="md" color="purple.200">
              Name: {selectedTokenName}
            </Text>
            <Text fontSize="md" color="purple.200">
              Symbol: {selectedTokenSymbol}
            </Text>
            <Text fontSize="md" color="purple.200">
              Balance: {selectedTokenAmount}
            </Text>
          </Box>
          <Input
            type="number"
            placeholder="Type your token amount to burn"
            onChange={(e) => setBurnAmount(e.target.value)}
          ></Input>
          <Button
            colorScheme="green"
            variant="solid"
            onClick={() => burnTokens(selectedToken, Number(burnAmount))}
          >
            Burn
          </Button>
        </Flex>
      </Box>
    </Container>
  );
};
export default TokenManager;
