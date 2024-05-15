import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Flex, Link, Image } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { Link as ReactRouterLink } from "react-router-dom";
import logoIcon from "../assets/kamikaze.png";

const Navbar = () => {
  const [toggleMenu, setToggle] = useState(false);
  const wallet = useWallet();
  useEffect(() => {
    if (wallet && wallet.connected) {
    } else {
    }
  }, [wallet]);
  return (
    <Flex
      color={"white"}
      py={"8px"}
      px={{ md: "30px", base: "10px" }}
      justify={"space-between"}
      alignItems={"center"}
      borderBottom="1px solid #606060"
    >
      <Flex alignItems={"center"} display={{ md: "flex", base: "none" }}>
        <Link to="/tokens/create" px={7} as={ReactRouterLink}>
          <Image src={logoIcon} minWidth={"100px"} />
        </Link>
        <Link to="/tokens/create" px="8px" as={ReactRouterLink}>
          Token Creator
        </Link>
        <Link to="/tokens/manage" px="8px" as={ReactRouterLink}>
          Manage Tokens
        </Link>
      </Flex>
      <WalletMultiButton
        style={{
          backgroundColor: "#BB2ADD",
          borderRadius: "30px",
          fontFamily: "Geist",
        }}
      />
      {toggleMenu && (
        <Flex
          position={"absolute"}
          top={"64px"}
          direction={"column"}
          boxShadow={"md"}
          background={"black"}
          p={3}
          gap={5}
          zIndex={10}
          width={"100%"}
          height={"-webkit-fill-available"}
          right={0}
          opacity={0.9}
          alignItems={"center"}
          display={{ md: "none", base: "flex" }}
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
