// GIT: Refactor: remove duplicated styles

// CREATED: GameCardContainer.tsx
// USED: GameCard, GameGrid

// Removing duplicated styles like width="200px" in GameCard and Skeletons.
// incase the style changes and we only change it on of the component.

// GameCardContainer
import { Box } from "@chakra-ui/react";
import React, { ReactNode } from "react";

// To pass a GameCard or GameCardSkeleton as a child to this component.
interface Props {
  children: ReactNode;
}

const GameCardContainer = ({ children }: Props) => {
  return (
    <>
      {/* Box is a primitive component in chakra and it returns a div. */}
      {/* mvoed properties from GameCards to here and applied to Box. */}
      {/* now we have defined a single place for our basic styles in Card. */}
      <Box width="300px" borderRadius={10} overflow="hidden">
        {/* now we pass a GameCard or GameCardSkeleton as a child to this component. So we make an interface. */}
        {children}
      </Box>
    </>
  );
};

export default GameCardContainer;

// GameCards
import React from "react";
import { Game } from "../hooks/useGames";
import { Card, CardBody, HStack, Heading, Image, Text } from "@chakra-ui/react";
import PlatformIconList from "./PlatformIconList";
import CriticScore from "./CriticScore";
import getCroppedImageUrl from "../services/image-url";

interface Props {
  game: Game;
}

const GameCards = ({ game }: Props) => {
  return (
    // <Card width="300px" borderRadius={10} overflow="hidden">
    // Note 12: Moved to GameCardContainer.tsx
    <Card>
      <Image src={getCroppedImageUrl(game.background_image)} />
      <CardBody>
        <Heading fontSize="2xl">{game.name}</Heading>
        <HStack justifyContent="space-between">
          <PlatformIconList
            platforms={game.parent_platforms.map((p) => p.platform)}
          />
          <CriticScore score={game.metacritic} />
        </HStack>
      </CardBody>
    </Card>
  );
};
export default GameCards;
