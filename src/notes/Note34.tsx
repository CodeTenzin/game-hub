// GIT: Refactor GameGrid
// USED: GameGrid.tsx

// GameGrid.tsx
import React, { useEffect, useState } from "react";
import apiClient from "../services/api-client";
import { SimpleGrid, Text } from "@chakra-ui/react";
import useGames, { Platform } from "../hooks/useGames";
import GameCards from "./GameCards";
import GameCardSkeleton from "./GameCardSkeleton";
import GameCardContainer from "./GameCardContainer";
import { Genre } from "../hooks/useGenres";
import { GameQuery } from "../App";

interface Props {
  gameQuery: GameQuery;
}

const GameGrid = ({ gameQuery }: Props) => {
  const { data, error, isLoading } = useGames(gameQuery);
  const skeletons = [1, 2, 3, 4, 5, 6];

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    // <>
    //  {/* Note34: we either have an error or data.
    // theres no need to put these 2 components next to each other.
    // split the return statement into 2 pieces.
    // using an if statement above return.  */}
    // {error && <Text>{error}</Text>}
    // Also <> no longer needed now.
    // just returning 1 SimpleGrid
    <SimpleGrid
      columns={{ sm: 1, md: 2, lg: 3, xl: 4 }}
      spacing={6}
      padding="10px"
    >
      {isLoading &&
        skeletons.map((skeleton) => (
          <GameCardContainer key={skeleton}>
            <GameCardSkeleton />
          </GameCardContainer>
        ))}
      {data.map((game) => (
        <GameCardContainer key={game.id}>
          {" "}
          <GameCards game={game} />
        </GameCardContainer>
      ))}
    </SimpleGrid>
    // </>
  );
};

export default GameGrid;
