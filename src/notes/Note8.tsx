// GIT: Display platform icons

// Used - "GameCards.tsx", "PlatformIconList.tsx" and "useGames.tsx"
// Check Network Tab -> Fetch/XHR -> Peview -> results -> "parent_platform" property.
// each there object in there is not a platform.
// Each 'parent_platform' has a 'platform' property which itself holds the 'platform' object.
// Called Design Smell. Not recommended.
// CREATED COMPONENT 'PLATFORMICONLIST.TSX'

/*
command + T, "#Game"
we can search for any symbols, functions and classes inor project.
added 'parent_platform' property in useGame interface and made another 
interface 'Platform'

INSTALL REACT ICONS
npm i react-icons@4.7.1

To render an icon, we need to map the icon with the platform name.
distraction from what this component is supposed to do.
So we move the mapping logic to a new Component.


// import react icons in PlatformIconList.tsx
import {FaWindows, FaPlaystation, FaXbox, FaApple, FaLinux, FaAndroid} from "react-icons/fa";

*/

// GameCards.tsx

import React from "react";
import { Game } from "../hooks/useGames";
import { Card, CardBody, Heading, Image, Text } from "@chakra-ui/react";
import PlatformIconList from "./PlatformIconList";

interface Props {
  game: Game;
}

const GameCards = ({ game }: Props) => {
  return (
    <Card borderRadius={10} overflow="hidden">
      <Image src={game.background_image} />
      <CardBody>
        <Heading fontSize="2xl">{game.name}</Heading>
        {/* {game.parent_platforms.map((platform) => (
          <Text>{platform.platform.name}</Text>
        ))} */}
        {/* below desturture and avoid platform.platform. */}
        {/* {game.parent_platforms.map(({ platform }) => (
          <Text>{platform.name}</Text>
        ))} */}
        {/* Above code moved to PlatformIconList.tsx */}
        {/* below passing the mapping to the props. */}
        {/* mapping each object we get to a platform object. */}
        {/* with this mapping, contructing a map of platform objects. */}
        <PlatformIconList
          platforms={game.parent_platforms.map((p) => p.platform)}
        />
      </CardBody>
    </Card>
  );
};
export default GameCards;

//PlatformIconList.tsx
import React from "react";
import { Platform } from "../hooks/useGames";
import { HStack, Icon, Text } from "@chakra-ui/react";
// imports react icons
import {
  FaWindows,
  FaPlaystation,
  FaXbox,
  FaApple,
  FaLinux,
  FaAndroid,
} from "react-icons/fa";
// import /md - material design
import { MdPhoneIphone } from "react-icons/md";
import { SiNintendo } from "react-icons/si";
// bs - bootstrap
import { BsGlobe } from "react-icons/bs";
import { IconType } from "react-icons";
//

// To render an icon, we need to map the icon with the platform name.
// distraction from what this component is supposed to do.
// So we move the mapping logic to a new Component.

interface Props {
  // to Platform interface, we export it from useGames.
  platforms: Platform[];
}

const PlatformIconList = ({ platforms }: Props) => {
  // Object will hold keys the represents the slug of each platform.
  //   const iconMap =  {
  // below added,  {[key: string]}, called 'index signature', wrapped in [ ].
  // it represents a key or properties in this object.
  // we have keys like pc, playstation, but with keys we dont have to specify these of thse string.
  // it says we have any number of keys of type string.
  // each key is mapped to a value of IconType.
  const iconMap: { [key: string]: IconType } = {
    // name: PlayStation
    // slug: playstation.  slug represents a textual ID.
    // better to rely on slugs since it not supposed to change.
    // below magging pc to FaWindows.
    pc: FaWindows,
    playstation: FaPlaystation,
    xbox: FaXbox,
    nintendo: SiNintendo,
    mac: FaApple,
    linux: FaLinux,
    android: FaAndroid,
    ios: MdPhoneIphone,
    web: BsGlobe,
  };
  return (
    <>
      {/* HStack setting the Y margin from column and the Titles. */}
      {/* marginY={1}, 1 is a multiple of theme.style value which is 4px, 1*4=4px */}
      {/* marginY={'10px'} for more precise value. */}
      <HStack marginY={1}>
        {/* moved from GameCards.  */}
        {/* {game.parent_platforms.map(({ platform }) => (
        <Text>{platform.name}</Text>
      ))} */}
        {/* below, removed destructure { platform } as the platform we have
      is a real platform object. */}
        {platforms.map((platform) => (
          // <Text>{platform.name}</Text>
          // below after creating the iconMap object and imports.
          // import Icon from Chakra.
          // icon color same as text color creating 'Visual Noise'.
          // color from Chakra -> Style System -> Default Theme.
          <Icon as={iconMap[platform.slug]} color="gray.500" />
          //[platform.slug] will show an error: Element implicitly has an 'any' type because expression of type 'string' can't be used to index type '{ pc: IconType; .....
          // solution is to annotate above at the object:
          // const iconMap: { [key: string]: IconType } = {... }
        ))}
      </HStack>
    </>
  );
};

export default PlatformIconList;
