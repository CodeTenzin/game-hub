// GIT: Built the color mode switch
// Created 'ColorModeSwitch.tsx'

//NABBAR.TSX Below
// Other changes in App.tsx - removed the bg color for aside and main.
import { HStack, Image, Text } from "@chakra-ui/react";
import logo from "../assets/logo.webp";
import ColorModeSwitch from "./ColorModeSwitch";

const NavBar = () => {
  return (
    // HStack to layout out our component horizontally.
    // justifyContent="space-between": after making the 'ColorModeSwitch.tsx'.
    <HStack justifyContent="space-between" padding="10px">
      {/* import the image from CHAKRA not the interface */}
      {/* webp images optimized for web. */}
      {/* we cant get image like src= {".../asset"}. import it. */}
      <Image src={logo} boxSize="60px"></Image>
      {/* Text - Chakra. Since its HStack, it will appear on its side. */}
      {/* <Text>NavBar </Text> */}
      <ColorModeSwitch />
    </HStack>
  );
};

export default NavBar;
