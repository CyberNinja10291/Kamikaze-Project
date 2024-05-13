import {
  Button,
  Text,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Box,
  FormControl,
  FormLabel,
  Switch,
} from "@chakra-ui/react";
import UnknownIcon from "../assets/unknown.png";

import { useDisclosure } from "@chakra-ui/react";
const TokenManageCard = ({
  imageUrl,
  tokenName,
  freezeAuthority,
  mintAuthority,
  immutable,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <>
        <Button
          bg="#494949"
          borderRadius={"full"}
          color={"white"}
          paddingX={"20px"}
          onClick={onOpen}
        >
          Options
        </Button>
        <Modal
          isCentered
          onClose={onClose}
          isOpen={isOpen}
          motionPreset="slideInBottom"
        >
          <ModalOverlay></ModalOverlay>
          <ModalContent bg={"#282828"}>
            <ModalBody
              color={"white"}
              flexDirection={"column"}
              alignItems={"center"}
              textAlign={"center"}
              borderRadius={"10px"}
              padding={"20px"}
            >
              {/* <Image margin={"auto"} src={imageUrl}></Image> */}
              <Box
                width={"150px"}
                height={"150px"}
                borderRadius={"50%"}
                overflow={"hidden"}
                margin={"auto"}
              >
                <Image
                  width={"100%"}
                  height={"100%"}
                  objectFit={"cover"}
                  src={imageUrl ? imageUrl : UnknownIcon}
                  alt={`${tokenName} Logo`}
                />
              </Box>

              <Text fontSize={"xx-large"}>{tokenName}</Text>
              <Box
                paddingTop={"10px"}
                paddingBottom={"40px"}
                bg={"#2D2D2D"}
                borderRadius={"10px"}
              >
                <Text color="#AFAFAF">
                  This is the greatest token ever! To the Moon!!!
                </Text>
              </Box>
              <Box marginTop={"20px"}>
                <FormControl
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <FormLabel htmlFor="isRequired" marginBottom={"0"}>
                    Revoke Freeze Authority
                  </FormLabel>

                  <Text fontSize={"13px"}>(+0.1 SOL) </Text>
                  {freezeAuthority ? (
                    <Switch marginLeft={"3"} id="isRequired" isChecked />
                  ) : (
                    <Switch marginLeft={"3"} id="isRequired" isReadOnly />
                  )}
                </FormControl>
                <FormControl
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <FormLabel htmlFor="isRequired" marginBottom={"0"}>
                    Revoke Mint Authority
                  </FormLabel>

                  <Text fontSize={"13px"}>(+0.1 SOL) </Text>
                  {mintAuthority ? (
                    <Switch marginLeft={"3"} id="isRequired" isChecked />
                  ) : (
                    <Switch marginLeft={"3"} id="isRequired" isReadOnly />
                  )}
                </FormControl>
                <FormControl
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <FormLabel htmlFor="isRequired" marginBottom={"0"}>
                    Immutable
                  </FormLabel>

                  <Text fontSize={"13px"}>(+0.1 SOL) </Text>
                  {immutable ? (
                    <Switch marginLeft={"3"} id="isRequired" isChecked />
                  ) : (
                    <Switch marginLeft={"3"} id="isRequired" isReadOnly />
                  )}
                </FormControl>
              </Box>

              <ModalCloseButton />
            </ModalBody>
            <ModalFooter justifyContent={"center"}></ModalFooter>
          </ModalContent>
        </Modal>
      </>
    </>
  );
};

export default TokenManageCard;
