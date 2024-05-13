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
} from "@chakra-ui/react";
import burnLogo from "../assets/burn.svg";
import { useDisclosure } from "@chakra-ui/react";
const Confirm = ({ onConfrim }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <>
        <Button
          mb="4"
          borderRadius={"full"}
          bg={"#BB2ADD"}
          color={"white"}
          onClick={onOpen}
        >
          Confirm Burns
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
              <Image margin={"auto"} src={burnLogo}></Image>
              <Text fontSize={"xx-large"}>Are you sure?</Text>
              <Text margin={"20px 10px"}>
                Once your token has been burned it cannot be undone. Are you
                sure you want to burn?
              </Text>
              <ModalCloseButton />
            </ModalBody>
            <ModalFooter justifyContent={"center"}>
              <Button
                bg="#FF7D7B"
                color={"#2D1A38"}
                mr={5}
                width={"40%"}
                borderRadius={"50px"}
                onClick={() => {
                  onConfrim();
                  onClose();
                }}
              >
                Confirm
              </Button>
              <Button
                bg={"#494949"}
                color={"white"}
                ml={5}
                width={"40%"}
                borderRadius={"50px"}
                onClick={onClose}
              >
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    </>
  );
};

export default Confirm;
