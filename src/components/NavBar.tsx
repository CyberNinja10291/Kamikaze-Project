import { useState } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Box, Flex, Link, useColorModeValue } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { Link as ReactRouterLink } from "react-router-dom";

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
        <Link to="/tokens/create" px={3} as={ReactRouterLink}>
          Create Token
        </Link>
        <Link to="/tokens" px={3} as={ReactRouterLink}>
          Tokens
        </Link>
        <Link to="/tokens/manage" px={3} as={ReactRouterLink}>
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
          <Link
            to="/tokens/create"
            px={3}
            width={"100%"}
            as={ReactRouterLink}
            onClick={() => setToggle(false)}
          >
            Create Token
          </Link>
          <Link
            to="/tokens"
            px={3}
            width={"100%"}
            as={ReactRouterLink}
            onClick={() => setToggle(false)}
          >
            Tokens
          </Link>
          <Link
            to="/tokens/manage"
            px={3}
            width={"100%"}
            as={ReactRouterLink}
            onClick={() => setToggle(false)}
          >
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
