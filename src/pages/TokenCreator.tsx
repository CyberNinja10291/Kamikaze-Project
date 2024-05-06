import { useState, useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WebIrys } from "@irys/sdk";

import { Stack, useToast } from "@chakra-ui/react";
import {
  Keypair,
  SystemProgram,
  Transaction,
  PublicKey,
} from "@solana/web3.js";
import {
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
  createInitializeMintInstruction,
  getMinimumBalanceForRentExemptMint,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
} from "@solana/spl-token";
import {
  createCreateMetadataAccountV3Instruction,
  PROGRAM_ID,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  SimpleGrid,
  Container,
  Textarea,
  Flex,
  Heading,
  Text,
  Switch,
  Spinner,
} from "@chakra-ui/react";
import { AttachmentIcon } from "@chakra-ui/icons";
// import { notify } from "../utils/notifications";
function TokenCreator() {
  const toast = useToast();
  const wallet = useWallet();
  const { connection } = useConnection();
  const { sendTransaction } = useWallet();

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [amount, setAmount] = useState("");
  const [decimals, setDecimals] = useState("");
  const [description, setDescription] = useState("");

  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState("");

  const [website, setWebsite] = useState("");
  const [twitter, setTwitter] = useState("");
  const [telegram, setTelegram] = useState("");
  const [discord, setDiscord] = useState("");

  const [revokeUpdate, setRevokeUpdate] = useState(false);
  const [socialLink, setSocialLink] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (wallet && wallet.connected) {
      const connectProvider = async () => {
        await wallet.connect();
        const provider = wallet.wallet.adapter;
        await provider.connect();
        setProvider(provider);
      };
      if (account != wallet.publicKey.toBase58()) {
        connectProvider();
        setAccount(wallet.publicKey.toBase58());
      }
    } else {
      setAccount("");
    }
  }, [wallet]);

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
  const handleCreateToken = async () => {
    try {
      if (!wallet || !wallet.connected) {
        NotifyMessage("Connect the Wallet", "warning");
        return;
      }
      setLoading(true);
      console.log("Handle Create TOken");
      console.log("connection", connection);
      console.log("balance", await connection.getBalance(wallet.publicKey));
      if (
        !tokenName ||
        !tokenSymbol ||
        !decimals ||
        !amount ||
        !description ||
        !imagePreview
      ) {
        console.log("Notify");
        NotifyMessage("Fill the all of the fields");
        return;
      }
      const info = await configureMetadata();
      console.log("Info", info);
      const from = wallet;
      const mintKeypair = Keypair.generate();
      const tokenATA = await getAssociatedTokenAddress(
        mintKeypair.publicKey,
        from.publicKey
      );
      const lamports = await getMinimumBalanceForRentExemptMint(connection);
      const createMetadataInstruction =
        createCreateMetadataAccountV3Instruction(
          {
            metadata: PublicKey.findProgramAddressSync(
              [
                Buffer.from("metadata"),
                PROGRAM_ID.toBuffer(),
                mintKeypair.publicKey.toBuffer(),
              ],
              PROGRAM_ID
            )[0],
            mint: mintKeypair.publicKey,
            mintAuthority: from.publicKey,
            payer: from.publicKey,
            updateAuthority: from.publicKey,
          },
          {
            createMetadataAccountArgsV3: {
              data: {
                name: info.tokenName,
                symbol: info.tokenSymbol,
                uri: info.metadata.toString(),
                // we don't need that
                creators: null,
                sellerFeeBasisPoints: 0,
                uses: null,
                collection: null,
              },
              isMutable: !revokeUpdate,
              collectionDetails: null,
            },
          }
        );
      const createNewTokenTransaction = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: from.publicKey,
          newAccountPubkey: mintKeypair.publicKey,
          space: MINT_SIZE,
          lamports: lamports,
          programId: TOKEN_PROGRAM_ID,
        }),
        createInitializeMintInstruction(
          mintKeypair.publicKey,
          info.decimals,
          from.publicKey,
          from.publicKey,
          TOKEN_PROGRAM_ID
        ),
        createAssociatedTokenAccountInstruction(
          from.publicKey,
          tokenATA,
          from.publicKey,
          mintKeypair.publicKey
        ),
        createMintToInstruction(
          mintKeypair.publicKey,
          tokenATA,
          from.publicKey,
          info.amount * Math.pow(10, info.decimals)
        ),
        createMetadataInstruction
      );
      console.log("createNewTokenTransaction", createNewTokenTransaction);
      const tx = await sendTransaction(createNewTokenTransaction, connection, {
        signers: [mintKeypair],
      });
      setLoading(false);

      NotifyMessage(
        `Created Token. Token address: ${mintKeypair.publicKey.toBase58()}`
      );
      console.log(
        `Created Token. Token address: ${mintKeypair.publicKey.toBase58()}`
      );
      console.log("Transaction completed", tx);
    } catch (error) {
      console.log("error", error);
      setLoading(false);
    }
  };

  const handleImageChange = async (event) => {
    const files = event.target.files;
    let reader = new FileReader();
    if (files) {
      reader.onload = function () {
        if (reader.result) {
          const uint8array = new Uint8Array(reader.result as ArrayBuffer);
          const blob = new Blob([uint8array], { type: "image/png" });
          const preview = URL.createObjectURL(blob);
          setImagePreview(preview);
          setImageFile(Buffer.from(reader.result as ArrayBuffer));
          console.log("ImageFile", imageFile);
        }
      };
      reader.readAsArrayBuffer(files[0]);
    }
  };

  const uploadData = async (
    data: Buffer,
    type: "image" | "json"
  ): Promise<string> => {
    const network = "mainnet";
    const token = "solana";
    // const rpcUrl = "https://api.devnet.solana.com"; // Required for devnet
    const rpcUrl =
      "https://mainnet.helius-rpc.com/?api-key=ee528ad2-b235-4251-9cc1-a1cf7ec3e06e";
    //   "https://devnet.helius-rpc.com/?api-key=ee528ad2-b235-4251-9cc1-a1cf7ec3e06e";
    // Create a wallet object
    const wallet = { rpcUrl: rpcUrl, name: "ethersv5", provider: provider };
    // Use the wallet object
    const webIrys = new WebIrys({ network, token, wallet });
    await webIrys.ready();

    console.log("Size", data.length);
    const size = data.length;

    // fund (if needed)
    const price = await webIrys.getPrice(size);
    await webIrys.fund(price);

    const value = type == "image" ? "image/png" : "application/json";
    const tx = await webIrys.upload(data, {
      tags: [{ name: "Content-Type", value: value }],
    });

    console.log(
      `Upload success content URL= https://gateway.irys.xyz/${tx.id}`
    );
    NotifyMessage(
      `Upload success content URL= https://gateway.irys.xyz/${tx.id}`,
      "success"
    );
    return `https://gateway.irys.xyz/${tx.id}`;
  };

  const configureMetadata = async () => {
    const imageUrl = await uploadData(imageFile, "image");

    let extensions = {};
    if (socialLink) {
      if (website != "") extensions["website"] = website;
      if (twitter != "") extensions["twitter"] = twitter;
      if (telegram != "") extensions["telegram"] = telegram;
      if (discord != "") extensions["discord"] = discord;
    }

    let content = {
      name: tokenName,
      symbol: tokenSymbol,
      description: description,
      image: imageUrl,
    };
    if (Object.keys(extensions).length != 0) {
      content["extentions"] = extensions;
    }
    console.log("content", content);
    const jsonContent = JSON.stringify(content, null, 4);
    const buffer = new TextEncoder().encode(jsonContent).buffer;
    const metadataUrl = await uploadData(Buffer.from(buffer), "json");

    console.log("imageUrl", imageUrl);
    console.log("metadataUrl", metadataUrl);

    return {
      tokenName: tokenName,
      tokenSymbol: tokenSymbol,
      metadata: metadataUrl,
      decimals: Number(decimals),
      amount: Number(amount),
    };
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
              Solana Token Creator
            </Heading>
          </Flex>

          <Text fontSize="md" display={{ base: "none", md: "block" }}>
            The perfect tool to create Solana SPL tokens. Simple, user friendly,
            and fast.
          </Text>
        </Flex>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input
              placeholder="Name"
              onChange={(e) => setTokenName(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Symbol</FormLabel>
            <Input
              placeholder="Symbol"
              onChange={(e) => setTokenSymbol(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Decimals</FormLabel>
            <Input
              placeholder="Decimals"
              type="number"
              value={decimals}
              onChange={(e) => setDecimals(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Supply</FormLabel>
            <Input
              placeholder="Supply"
              type="number"
              onChange={(e) => setAmount(e.target.value)}
            />
          </FormControl>

          <FormControl display={"flex"} flexDirection={"column"}>
            <FormLabel>Image</FormLabel>
            <Input
              type="file"
              accept="image/*" // Optionally, specify the types of images accepted
              onChange={(e) => handleImageChange(e)} // Replace with your method to handle file selection
              id="images"
              name="images"
              hidden
            />
            <FormLabel
              htmlFor="images"
              border={"1px solid #A2A8A0"}
              borderRadius={"5px"}
              alignItems={"center"}
              justifyContent={"center"}
              display={"flex"}
              height={"200px"}
              margin={"0"}
            >
              {!imagePreview ? (
                <AttachmentIcon />
              ) : (
                <img
                  src={imagePreview}
                  width={"150px"}
                  style={{ maxHeight: "100%" }}
                />
              )}
            </FormLabel>
          </FormControl>
          <FormControl display={"flex"} flexDirection={"column"}>
            <FormLabel>Description(Optional)</FormLabel>
            <Textarea
              placeholder="Put the description of the Token"
              height={"200px"}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormControl>
        </SimpleGrid>
        <FormControl display={"flex"}>
          <FormLabel htmlFor="isRequired">Add Social Links :</FormLabel>
          <Switch
            id="isRequired"
            isRequired
            onChange={(e) => setSocialLink(e.target.checked)}
          />
        </FormControl>
        {socialLink && (
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
            <FormControl>
              <FormLabel>Website</FormLabel>
              <Input
                placeholder="Put your website"
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Twitter</FormLabel>
              <Input
                placeholder="Put your Twitter"
                type="text"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Telegram</FormLabel>
              <Input
                placeholder="Put your telegram"
                type="text"
                value={telegram}
                onChange={(e) => setTelegram(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Discord</FormLabel>
              <Input
                placeholder="Put your discord"
                type="text"
                value={discord}
                onChange={(e) => setDiscord(e.target.value)}
              />
            </FormControl>
          </SimpleGrid>
        )}
        <FormControl display={"flex"} marginY={"25px"}>
          <FormLabel htmlFor="isRequired">Revoke Update (Immutable)</FormLabel>
          <Switch
            id="isRequired"
            isRequired
            onChange={(e) => setRevokeUpdate(e.target.checked)}
          />
        </FormControl>
        <Button colorScheme="green" onClick={() => handleCreateToken()}>
          Create Token
        </Button>
      </Box>
      {loading && (
        <Stack
          width={"100%"}
          height={"100%"}
          position={"absolute"}
          top={0}
          left={0}
          background={"#666666aa"}
          alignItems={"center"}
          pt={"40%"}
        >
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        </Stack>
      )}
    </Container>
  );
}

export default TokenCreator;
