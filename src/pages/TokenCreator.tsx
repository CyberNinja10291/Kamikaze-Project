import { useState, useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WebIrys } from "@irys/sdk";
import { useToast } from "@chakra-ui/react";
import { CheckCircleIcon, WarningIcon, CloseIcon } from "@chakra-ui/icons";
import ProgressBar from "../components/ProgressBar";
import {
  Keypair,
  SystemProgram,
  Transaction,
  PublicKey,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
  createInitializeMintInstruction,
  getMinimumBalanceForRentExemptMint,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  createSetAuthorityInstruction,
  AuthorityType,
} from "@solana/spl-token";
import websiteIcon from "../assets/website.svg";
import twitterIcon from "../assets/twitter.svg";
import telegramIcon from "../assets/telegram.svg";
import discordIcon from "../assets/discord.svg";

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
  Image,
  InputGroup,
  InputLeftElement,
  CloseButton,
  Spinner,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
function TokenCreator() {
  const toast = useToast();
  const wallet = useWallet();
  const { connection } = useConnection();
  const { sendTransaction } = useWallet();

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFileName, setImageFileName] = useState("");

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
  const [revokeMintAuthority, setRevokeMintAuthority] = useState(false);
  const [revokeFreezeAuthority, setRevokeFreezeAuthority] = useState(false);

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

  const handleCreateToken = async () => {
    try {
      if (!wallet || !wallet.connected) {
        showToast("Fill the all of the fields", "", WarningIcon, 5000);
        return;
      }
      if (
        !tokenName ||
        !tokenSymbol ||
        !decimals ||
        !amount ||
        !description ||
        !imagePreview
      ) {
        showToast("Fill the all of the fields", "", WarningIcon, 5000);
        return;
      }

      const info = await configureMetadata();
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
      let createNewTokenTransaction = new Transaction().add(
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
      if (revokeMintAuthority) {
        createNewTokenTransaction.add(
          createSetAuthorityInstruction(
            mintKeypair.publicKey, // Token Mint Address
            wallet.publicKey, // Current Authority
            AuthorityType.MintTokens, // : AuthorityType.FreezeAccount, // New Authority (null disables minting)
            null,
            []
          )
        );
      }
      if (revokeFreezeAuthority) {
        createNewTokenTransaction.add(
          createSetAuthorityInstruction(
            mintKeypair.publicKey, // Token Mint Address
            wallet.publicKey, // Current Authority
            AuthorityType.FreezeAccount, // New Authority (null disables minting)
            null,
            []
          )
        );
      }
      showToast("Confirming Transaction", "", Spinner, null);
      const tx = await sendTransaction(createNewTokenTransaction, connection, {
        signers: [mintKeypair],
      });
      toast.closeAll();
      showToast("Token Created", "", CheckCircleIcon, 5000);
      console.log(
        `Created Token. Token address: ${mintKeypair.publicKey.toBase58()} ${tx}`
      );
    } catch (error) {
      showToast("Transaction Failed", "", CloseIcon, 5000);
      setTimeout(() => {
        toast.closeAll();
      }, 5000);
      console.log("error", error);
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
          setImageFileName(files[0].name);
          setImageFile(Buffer.from(reader.result as ArrayBuffer));
        }
      };
      reader.readAsArrayBuffer(files[0]);
    }
  };

  const uploadData = async (
    data: Buffer,
    type: "image" | "json"
  ): Promise<string> => {
    const network = "devnet";
    const token = "solana";
    // const rpcUrl = "https://api.devnet.solana.com"; // Required for devnet
    const rpcUrl =
      // "https://mainnet.helius-rpc.com/?api-key=ee528ad2-b235-4251-9cc1-a1cf7ec3e06e";
      "https://devnet.helius-rpc.com/?api-key=ee528ad2-b235-4251-9cc1-a1cf7ec3e06e";
    // Create a wallet object
    const webIryswallet = {
      rpcUrl: rpcUrl,
      name: "ethersv5",
      provider: provider,
    };
    // Use the wallet object
    const webIrys = new WebIrys({ network, token, wallet: webIryswallet });
    await webIrys.ready();

    const size = data.length;

    // fund (if needed)
    const price = await webIrys.getPrice(size);
    const fundedAmount = await webIrys.getBalance(wallet.publicKey.toBase58());
    if (fundedAmount < price) {
      await webIrys.fund(LAMPORTS_PER_SOL);
    }

    const value = type == "image" ? "image/png" : "application/json";
    const tx = await webIrys.upload(data, {
      tags: [{ name: "Content-Type", value: value }],
    });

    console.log(
      `Upload success content URL= https://gateway.irys.xyz/${tx.id}`
    );
    return `https://gateway.irys.xyz/${tx.id}`;
  };

  const configureMetadata = async () => {
    showToast("Uploading image", "", Spinner, null);
    const imageUrl = await uploadData(imageFile, "image");
    toast.closeAll();
    showToast(
      "Token Symbol image upload successful",
      "",
      CheckCircleIcon,
      null
    );

    let extensions = {};
    if (website != "") extensions["website"] = website;
    if (twitter != "") extensions["twitter"] = twitter;
    if (telegram != "") extensions["telegram"] = telegram;
    if (discord != "") extensions["discord"] = discord;

    let content = {
      name: tokenName,
      symbol: tokenSymbol,
      description: description,
      image: imageUrl,
    };
    if (Object.keys(extensions).length != 0) {
      content["extentions"] = extensions;
    }
    const jsonContent = JSON.stringify(content, null, 4);
    const buffer = new TextEncoder().encode(jsonContent).buffer;
    showToast("Uploading metadata", "", Spinner, null);
    const metadataUrl = await uploadData(Buffer.from(buffer), "json");
    toast.closeAll();
    showToast("Token metaData upload successful", "", CheckCircleIcon, 5000);

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
  return (
    <Container
      maxW={{ base: "100%", md: "full" }}
      padding={"20px 40px"}
      border={"1px"}
      borderColor={"yellow"}
      color={"#AFAFAF"}
    >
      <Box
        p={4}
        borderRadius="5"
        boxShadow="dark-lg"
        paddingX={"5%"}
        paddingBottom={"30px"}
        bg={"#282828"}
        fontFamily={"Arial"}
      >
        <Flex
          align="center"
          justify="space-between"
          marginBottom="20px"
          color={"white"}
        >
          <Flex flexDirection={"column"} alignItems={"start"}>
            <Heading letterSpacing={"tighter"} fontFamily={"Arial"}>
              Solana Token Creator
            </Heading>
            <Text fontSize="md" display={{ base: "none", md: "block" }}>
              Easily Create your own Solana SPL Token in just a few steps.
            </Text>
          </Flex>
          <Link to={"/tokens/manage"}>
            <Button
              backgroundColor={"#BB2ADD"}
              color={"white"}
              borderRadius={"20px"}
            >
              Manage Tokens
            </Button>
          </Link>
        </Flex>
        <SimpleGrid
          columns={{ base: 1, md: 2 }}
          spacing={8}
          marginBottom={"30px"}
        >
          <FormControl>
            <FormLabel>Token name (e.g. Kamikaze STC)</FormLabel>
            <Input
              placeholder="Enter token name"
              bg={"#2D2D2D"}
              border={"0px"}
              onChange={(e) => setTokenName(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Token symbol (Max. 8 characters)</FormLabel>
            <Input
              placeholder="Enter token symbol"
              bg={"#2D2D2D"}
              border={"0px"}
              onChange={(e) => setTokenSymbol(e.target.value)}
            />
          </FormControl>

          <FormControl display={"flex"} flexDirection={"column"}>
            <FormLabel>Description(Optional)</FormLabel>
            <Textarea
              placeholder="Enter project description"
              height={{ base: "200px", md: "300px" }}
              bg={"#2D2D2D"}
              border={"0px"}
              onChange={(e) => setDescription(e.target.value)}
              maxHeight={"150px"}
              minHeight={"150px"}
              paddingX={"16px"}
              paddingY={"18px"}
            />
          </FormControl>
          <FormControl display={"flex"} flexDirection={"column"}>
            <FormLabel>
              Symbol image (128x128 or larger is recommended)
            </FormLabel>
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
              borderRadius={"5px"}
              alignItems={"center"}
              justifyContent={"center"}
              display={"flex"}
              // height={{ base: "200px", md: "300px" }}
              height={"150px"}
              margin={"0"}
              bg={"#2D2D2D"}
              border={"0px"}
            >
              {!imagePreview ? (
                <Flex
                  flexDirection={"column"}
                  alignItems={"center"}
                  _hover={{
                    cursor: "pointer",
                    // textDecoration: "underline",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    fill="none"
                  >
                    <path
                      d="M21.6663 31.6666V25H26.6663L19.9997 16.6666L13.333 25H18.333V31.6666H21.6663Z"
                      fill="white"
                    />
                    <path
                      d="M11.6663 31.6667H14.9997V28.3334H11.6663C8.90967 28.3334 6.66634 26.09 6.66634 23.3334C6.66634 20.9934 8.66467 18.74 11.1213 18.3084L12.0897 18.1384L12.4097 17.2084C13.5813 13.79 16.4913 11.6667 19.9997 11.6667C24.5947 11.6667 28.333 15.405 28.333 20V21.6667H29.9997C31.838 21.6667 33.333 23.1617 33.333 25C33.333 26.8384 31.838 28.3334 29.9997 28.3334H24.9997V31.6667H29.9997C33.6763 31.6667 36.6663 28.6767 36.6663 25C36.6638 23.5061 36.1607 22.056 35.2375 20.8814C34.3143 19.7068 33.0241 18.8755 31.573 18.52C30.8447 12.7834 25.933 8.33337 19.9997 8.33337C15.4063 8.33337 11.4163 11.0184 9.59467 15.25C6.01467 16.32 3.33301 19.7 3.33301 23.3334C3.33301 27.9284 7.07134 31.6667 11.6663 31.6667Z"
                      fill="white"
                    />
                  </svg>
                  <p>Upload an Image</p>
                </Flex>
              ) : (
                <Box
                  display={"flex"}
                  flexDirection={"column"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  width={"100%"}
                >
                  <Box
                    width={"100px"}
                    height={"100px"}
                    borderRadius={"50%"}
                    overflow={"hidden"}
                  >
                    <Image
                      width={"100%"}
                      height={"100%"}
                      objectFit={"cover"}
                      src={imagePreview}
                    />
                  </Box>
                  <Text
                    color={"white"}
                    align={"center"}
                    whiteSpace={"nowrap"}
                    width={"70%"}
                    overflow={"hidden"}
                    textOverflow={"ellipsis"}
                  >
                    {imageFileName}
                  </Text>
                  <Text align={"center"} fontSize={"12px"} color={"#AFAFAF"}>
                    (Click to re-upload)
                  </Text>
                </Box>
              )}
            </FormLabel>
          </FormControl>
        </SimpleGrid>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
          <SimpleGrid columns={{ base: 1, md: 1 }} spacing={8}>
            <FormControl>
              <FormLabel>Socials (Optional)</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <img src={websiteIcon} />
                </InputLeftElement>
                {/* <Input type="tel" placeholder="Phone number" /> */}
                <Input
                  placeholder="Website URL"
                  type="text"
                  value={website}
                  bg={"#2D2D2D"}
                  border={"0px"}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </InputGroup>
            </FormControl>

            <FormControl>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <img src={twitterIcon} />
                </InputLeftElement>
                <Input
                  placeholder="Twitter URL"
                  type="text"
                  value={twitter}
                  bg={"#2D2D2D"}
                  border={"0px"}
                  onChange={(e) => setTwitter(e.target.value)}
                />
              </InputGroup>
            </FormControl>

            <FormControl>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <img src={telegramIcon} />
                </InputLeftElement>
                <Input
                  placeholder="Telegram Group URL"
                  type="text"
                  value={telegram}
                  bg={"#2D2D2D"}
                  border={"0px"}
                  onChange={(e) => setTelegram(e.target.value)}
                />
              </InputGroup>
            </FormControl>

            <FormControl>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <img src={discordIcon} />
                </InputLeftElement>
                <Input
                  placeholder="Discord"
                  type="text"
                  value={discord}
                  bg={"#2D2D2D"}
                  border={"0px"}
                  onChange={(e) => setDiscord(e.target.value)}
                />
              </InputGroup>
            </FormControl>
          </SimpleGrid>
          <SimpleGrid columns={{ base: 1, md: 1 }} spacing={0}>
            <FormControl>
              <FormLabel>Token decimals (0~9)</FormLabel>
              <Input
                placeholder="Enter Token decimals"
                type="number"
                min={"0"}
                max={"9"}
                step={"1"}
                value={decimals}
                bg={"#2D2D2D"}
                border={"0px"}
                onChange={(e) =>
                  setDecimals(Number(e.target.value) > 9 ? "9" : e.target.value)
                }
              />
            </FormControl>
            <FormControl>
              <FormLabel>Token supply</FormLabel>
              <Input
                placeholder="Enter quantity of tokens to issue"
                type="number"
                bg={"#2D2D2D"}
                border={"0px"}
                marginBottom={"20px"}
                onChange={(e) => setAmount(e.target.value)}
              />
              <Text align={"left"} fontSize={"14px"}>
                Creation Fee: 0.15 SOL
              </Text>
            </FormControl>
          </SimpleGrid>
        </SimpleGrid>
        <Text align={"left"} marginTop={"20px"}>
          Advanced options
        </Text>
        <SimpleGrid
          columns={{ sm: 1, md: 3 }}
          spacing={3}
          color={"white"}
          marginY={"20px"}
        >
          <FormControl
            display={"flex"}
            justifyContent={"left"}
            alignItems={"center"}
          >
            <FormLabel htmlFor="isRequired" marginBottom={"0"}>
              Revoke Freeze Authority
            </FormLabel>
            <Text fontSize={"13px"}>(+0.1 SOL)</Text>
            <Switch
              id="isRequired"
              marginLeft={"3"}
              isRequired
              onChange={(e) => setRevokeFreezeAuthority(e.target.checked)}
            />
          </FormControl>
          <FormControl
            display={"flex"}
            justifyContent={"left"}
            alignItems={"center"}
          >
            <FormLabel htmlFor="isRequired" marginBottom={"0"}>
              Revoke Mint Authority
            </FormLabel>
            <Text fontSize={"13px"}>(+0.1 SOL)</Text>
            <Switch
              marginLeft={"3"}
              id="isRequired"
              isRequired
              onChange={(e) => setRevokeMintAuthority(e.target.checked)}
            />
          </FormControl>
          <FormControl
            display={"flex"}
            justifyContent={"left"}
            alignItems={"center"}
          >
            <FormLabel htmlFor="isRequired" marginBottom={"0"}>
              Immutable
            </FormLabel>

            <Text fontSize={"13px"}>(+0.1 SOL) </Text>
            <Switch
              marginLeft={"3"}
              id="isRequired"
              isRequired
              onChange={(e) => setRevokeUpdate(e.target.checked)}
            />
          </FormControl>
        </SimpleGrid>

        <Button
          marginY={"30px"}
          backgroundColor={"#BB2ADD"}
          borderRadius={"20px"}
          color={"white"}
          onClick={() => handleCreateToken()}
        >
          Create Token
        </Button>
      </Box>
    </Container>
  );
}

export default TokenCreator;
