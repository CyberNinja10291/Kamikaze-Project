import { useState } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Box, Flex, Link, useColorModeValue } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";

const Navbar = () => {
  // These colors can be adjusted based on your theme
  const [toggleMenu, setToggle] = useState(false);
  const bg = useColorModeValue("gray.800", "gray.900");
  const color = useColorModeValue("white", "gray.200");

  return (
    <Flex
      bg={bg}
      color={color}
      minH={"60px"}
      py={{ base: 2 }}
      px={{ base: 4 }}
      align={"center"}
      justify={"space-between"}
    >
      <Flex align={"center"} mr={5}>
        <Box ml={3} fontWeight="bold" fontSize={"xx-large"}>
          Kamikaze
        </Box>
      </Flex>
      <Flex
        justify={"space-between"}
        alignItems={"center"}
        display={{ md: "block", base: "none" }}
      >
        <Link href="/tokens/create" px={3}>
          Create Token
        </Link>
        <Link href="/tokens" px={3}>
          Tokens
        </Link>
        <Link href="/tokens/manage" px={3}>
          Manage Token
        </Link>
        <WalletMultiButton
          style={{
            backgroundColor: "#2b2b8f",
          }}
        />
      </Flex>
      {toggleMenu && (
        <Flex
          position={"absolute"}
          top={"64px"}
          direction={"column"}
          boxShadow={"md"}
          background={"grey"}
          p={3}
          gap={5}
          zIndex={10}
          width={"100%"}
          height={"-webkit-fill-available"}
          right={0}
          opacity={0.9}
          alignItems={"center"}
        >
          <Link href="/tokens/create" px={3}>
            Create Token
          </Link>
          <Link href="/tokens" px={3}>
            Tokens
          </Link>
          <Link href="/tokens/manage" px={3}>
            Manage Token
          </Link>
          <WalletMultiButton
            style={{
              background: "transparent",
            }}
          />
        </Flex>
      )}

      <Flex display={{ md: "none" }}>
        <HamburgerIcon onClick={() => setToggle(!toggleMenu)} />
      </Flex>
    </Flex>
  );
};

export default Navbar;
