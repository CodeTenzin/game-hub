// GIT: Building game cards
// Created 'GameCards.tsx' component,

// RAWG API has background_image property.
// Added, background_image: string;, to the 'Game' interface in 'useGames' hook.

// Added export default on interface on useGames.tsx hook

// 2 changes below on code. 'GameGrid.tsx' and 'GameCards.tsx'

// Below GameCards.tsx
import React from "react";
import { Game } from "../hooks/useGames";
import { Card, CardBody, Heading, Image } from "@chakra-ui/react";

// We should pass a Game object as a prop to this component.

// define the shape of Props/
interface Props {
  // imported interface from useGames hook.
  game: Game;
}

const GameCards = ({ game }: Props) => {
  return (
    // borderRadius 10px. Radius only shown applied to bottom
    // as image is bigger than the container.
    // so set overflow = 'hidden'
    <Card borderRadius={10} overflow="hidden">
      {/* Card and Image from Chakra. */}
      <Image src={game.background_image} />
      <CardBody>
        {/* Heading from Chakra. */}
        <Heading fontSize="2xl">{game.name}</Heading>
      </CardBody>
    </Card>
  );
};

export default GameCards;

//--------------------------------------------------------------
// Below GameGrid.tsx
import React, { useEffect, useState } from "react";
import apiClient from "../services/api-client";
import { SimpleGrid, Text } from "@chakra-ui/react";
import useGames from "../hooks/useGames";
import GameCards from "./GameCards";

const GameGrid = () => {
  const { games, error } = useGames();

  return (
    <>
      {error && <Text>{error}</Text>}
      {/* <ul> */}
      {/* Changed to <SimpleGrid> from Chakra, spacing of 10px. */}
      {/* <SimpleGrid columns={3} spacing={10}> */}
      {/* Instead af hardcoding the column, we pass an object, so depending
      on the screen size, we column changes. 
      phone 1 col, tablet 2 col, comp 3 col.  */}
      <SimpleGrid
        columns={{ sm: 1, md: 2, lg: 3, xl: 4 }}
        spacing={10}
        padding="10px"
        // padding applied, on mobile the Cards touches the side of the screen.
      >
        {games.map((game) => (
          //   <li key={game.id}>{game.name}</li>
          <GameCards key={game.id} game={game} />
        ))}
      </SimpleGrid>
      {/* </ul> */}
    </>
  );
};

export default GameGrid;
