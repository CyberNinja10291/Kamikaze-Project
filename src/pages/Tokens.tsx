import { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction } from "@solana/web3.js";
import {
  getMint,
  createSetAuthorityInstruction,
  AuthorityType,
} from "@solana/spl-token";
import { RevokeAuthority } from "../components/Revoke";
import { VStack, Box, Container, Flex, Heading, Text } from "@chakra-ui/react";
import { getAssetsByAuthority } from "../utils/getMetaData";

enum Option {
  Freeze,
  Mint,
}

const Tokens = () => {
  const toast = useToast();
  const { connection } = useConnection();
  const wallet = useWallet();
  const [account, setAccount] = useState("");
  const [mintAuthority, setMintAuthority] = useState([]);
  const [freezeAuthority, setfreezeAuthority] = useState([]);
  const [revokeMintToken, setRevokeMintToken] = useState("");
  const [revokeFreezeToken, setRevokeFreezeToken] = useState("");
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
        console.log("connect");
      }
    } else {
      setAccount("");
      setMintAuthority([]);
      setfreezeAuthority([]);
    }
  }, [wallet]);
  const getTokens = async () => {
    let mintAuthorityList = [],
      freezeAuthorityList = [];
    console.log(wallet.publicKey.toBase58());
    const data = await getAssetsByAuthority(wallet.publicKey.toBase58());
    for (let i = 0; i < data.items.length; i++) {
      mintAuthorityList.push(data.items[i].id);
      freezeAuthorityList.push(data.items[i].id);
    }
    setMintAuthority(mintAuthorityList);
    setfreezeAuthority(freezeAuthorityList);
  };

  const revoke = async (option: Option) => {
    try {
      if (!wallet || !wallet.connected) {
        NotifyMessage("Connect the Wallet", "warning");
        return;
      }
      const mintAddress = option ? revokeMintToken : revokeFreezeToken;
      if (!mintAddress) {
        return;
      }

      // Create a new PublicKey object for the mint address
      const mintPublicKey = new PublicKey(mintAddress);

      // Fetch the mint information to get the current mint authority
      const mintInfo = await getMint(connection, mintPublicKey);
      console.log("mint Info", mintInfo);

      if (!mintInfo.mintAuthority && option == Option.Mint) {
        NotifyMessage("Minting is already disabled or there is no authority.");
        return;
      }
      if (!mintInfo.freezeAuthority && option == Option.Freeze) {
        NotifyMessage(
          "Freeze account is already disabled or there is no authority."
        );
        return;
      }

      // Create the instruction to disable minting
      const instruction = createSetAuthorityInstruction(
        mintPublicKey, // Token Mint Address
        option ? mintInfo.mintAuthority : mintInfo.freezeAuthority, // Current Authority
        option ? AuthorityType.MintTokens : AuthorityType.FreezeAccount, // New Authority (null disables minting)
        null,
        []
      );

      // Create a new transaction
      const transaction = new Transaction().add(instruction);

      await wallet.sendTransaction(transaction, connection, { signers: [] });
      NotifyMessage("Successfully Revoked");
      await getTokens();
    } catch (error) {
      console.error("Failed to disable minting:", error);
    }
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
              Revoke Authority
            </Heading>
          </Flex>

          <Text fontSize="md" display={{ base: "none", md: "block" }}>
            Begin the seamless process of revoke your SPL token's authority
          </Text>
        </Flex>
        <VStack
          spacing={3}
          borderRadius="lg"
          boxShadow="md"
          width="100%"
          alignItems="stretch"
        >
          <RevokeAuthority
            title={"Revoke Mint Authority"}
            subTitle={
              "Revoking mint authority ensures that there can be no more tokens minted than the total supply. This provides security and peace of mind to buyers."
            }
            button={"Revoke Mint Authority"}
            onSelectToken={setRevokeMintToken}
            onRevokeAuthority={() => revoke(Option.Mint)}
            selectedToken={revokeMintToken}
            tokenList={mintAuthority}
          ></RevokeAuthority>

          <RevokeAuthority
            title={"Revoke Freeze Authority"}
            subTitle={
              "If you want to create a liquidity pool you will need to 'Revoke Freeze Authority' of the Token, you can do that here."
            }
            button={"Revoke Freeze Authority"}
            onSelectToken={setRevokeFreezeToken}
            onRevokeAuthority={() => revoke(Option.Freeze)}
            selectedToken={revokeFreezeToken}
            tokenList={freezeAuthority}
          ></RevokeAuthority>
        </VStack>
      </Box>
    </Container>
  );
};
export default Tokens;
