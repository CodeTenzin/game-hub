// GIT: Build search input
// CREATED: SearchInput.tsx
// Used: NavBar.tsx AND ColorModeSwitch.tsx

// Building Seatch Input to search games.

// End Note: inspect the mobile and the device view size.

// SearchInput.tsx
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import React from "react";
import { BsSearch } from "react-icons/bs";

const SearchInput = () => {
  return (
    // Added InputGroup inorder to add an icon and group it.
    <InputGroup>
      {/* BsSearch - Bootstrap search icon. */}
      <InputLeftElement children={<BsSearch />} />
      {/* variant={"filled"} added to fill the input box with color. the light
      dark one. */}
      <Input
        borderRadius={20}
        placeholder="Search games..."
        variant={"filled"}
      />
    </InputGroup>
  );
};

export default SearchInput;

// NavBar.tsx
import { HStack, Image, Text } from "@chakra-ui/react";
import logo from "../assets/logo.webp";
import ColorModeSwitch from "./ColorModeSwitch";
import SearchInput from "./SearchInput";

const NavBar = () => {
  return (
    // <HStack justifyContent="space-between" padding="10px">
    // Note26: After adding the SearchInput component, we dont need to distribute
    // space like "space-between", so remove it. wont make a difference.
    <HStack padding="10px">
      <Image src={logo} boxSize="60px"></Image>
      {/* Added. */}
      {/* After adding, the ColorMode switch 'Dark' and 'Mode' wrap on top of each other. 
      Go to ColorModeSwitch.tsx compoenent for the fix.*/}
      <SearchInput />
      <ColorModeSwitch />
    </HStack>
  );
};

export default NavBar;

// ColorModeSwitch.tsx
// import useColorMode;
import { HStack, Switch, Text, useColorMode } from "@chakra-ui/react";

const ColorModeSwitch = () => {
  // to work with ColorMode we use a custom hook called useColorMode.
  const { toggleColorMode, colorMode } = useColorMode();

  return (
    <HStack>
      {/* Switch and Text: Chakra version. */}
      {/* isChecked checks the switch of color mode is dark. */}
      {/* all the functionality is already built for us.  */}
      <Switch
        // colorScheme: the color of the switch when turned on.
        colorScheme="green"
        isChecked={colorMode === "dark"}
        onChange={toggleColorMode}
      />
      {/* Note26: whiteSpace added for the no wrap around.  */}
      <Text whiteSpace={"nowrap"}>Dark Mode</Text>
    </HStack>
  );
};

export default ColorModeSwitch;
