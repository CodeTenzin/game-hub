// GIT: Show loading skeletons

// CREATE component: GameCardSkeleton.tsx
// USED: useGames.tsx, GameGrid.tsx, GameCards.tsx

// updating UX with Loading skeletons.
// while the back end returns the list of games, show loading skeletons.

// to render a skeleton, we should create a seperate Component.
// it will look like a GameCard but not GameCard.
// we can only render a GameCard if it has a Game Object.
// in this case, we only render a skeleton.

// GameCardSkeleton.tsx
import { Card, CardBody, Skeleton, SkeletonText } from "@chakra-ui/react";
import React from "react";

// to render a skeleton, we should create a seperate Component.
// it will look like a GameCard but not GameCard.
// we can only render a GameCard if it has a Game Object.
// in this case, we only render a skeleton.

const GameCardSkeleton = () => {
  return (
    <>
      {/* will not contain an image, but a skeleton. */}
      {/* its like a placeholder for an image thats being loaded. */}
      {/* The skeleton doesnt align to the structure. 
      So pass an matching arbitrary value (check what works on differnet
      devices) to both Card here and GameCards */}
      {/* apply the same attributes of the GameCard to the skeleton component.
      borderRadius={10} overflow="hidden". */}
      {/* width="300px" code is duplicated here and also GameCard.tsx. 
      works right now so first "Commit" the code incase the App breaks
      when working around it. */}
      <Card width="300px" borderRadius={10} overflow="hidden">
        {/* Skeleton from Chakra. Arbitrary height of 200. See what works for u. */}
        <Skeleton height="200px" />
        {/* we are mimicing the same structure as out GameCard. */}
        <CardBody>
          <SkeletonText />
        </CardBody>
      </Card>
    </>
  );
};

export default GameCardSkeleton;

// GameCards.tsx
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
    // Note 11: to match the skeleton size. width 300px.
    <Card width="300px" borderRadius={10} overflow="hidden">
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

// GameGrid.tsx
import React, { useEffect, useState } from "react";
import apiClient from "../services/api-client";
import { SimpleGrid, Text } from "@chakra-ui/react";
import useGames from "../hooks/useGames";
import GameCards from "./GameCards";
import GameCardSkeleton from "./GameCardSkeleton";

const GameGrid = () => {
  // const { games, error } = useGames();
  // Note11: for loading skeleton
  const { games, error, isLoading } = useGames();
  // array to fill the skeletons.
  const skeletons = [1, 2, 3, 4, 5, 6];

  return (
    <>
      {error && <Text>{error}</Text>}
      <SimpleGrid
        columns={{ sm: 1, md: 2, lg: 3, xl: 4 }}
        spacing={10}
        padding="10px"
      >
        {/* if loading is true, map skeleton to a GameCardSkeleton component*/}
        {isLoading &&
          skeletons.map((skeleton) => <GameCardSkeleton key={skeleton} />)}
        {games.map((game) => (
          <GameCards key={game.id} game={game} />
        ))}
      </SimpleGrid>
    </>
  );
};

export default GameGrid;
