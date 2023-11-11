// GIT: Displaying critic score

// Create component: CriticScore.tsx
// used CriticScore.tsx, useGames.tsx, GameCards.tsx

// Check Network -> result -> metacritic property.
// color of the badge need to be dependent on the screen.
// color of score depending on the scroe.
// dont want all the logic in the GameCard.

//GAMECARDS.TSX
import React from "react";
import { Game } from "../hooks/useGames";
import { Card, CardBody, HStack, Heading, Image, Text } from "@chakra-ui/react";
import PlatformIconList from "./PlatformIconList";
import CriticScore from "./CriticScore";

interface Props {
  game: Game;
}

const GameCards = ({ game }: Props) => {
  return (
    <Card borderRadius={10} overflow="hidden">
      <Image src={game.background_image} />
      <CardBody>
        <Heading fontSize="2xl">{game.name}</Heading>
        {/* to move the score to the right side. */}
        <HStack justifyContent="space-between">
          <PlatformIconList
            platforms={game.parent_platforms.map((p) => p.platform)}
          />
          {/* to display scores. */}
          <CriticScore score={game.metacritic} />
          {/* above name property of 'metacritic' not preferred, as the game
        can have various metadata. But its a provided one. */}
        </HStack>
      </CardBody>
    </Card>
  );
};
export default GameCards;

//CRITICSCORE.TSX
import { Badge } from "@chakra-ui/react";
import React from "react";

// to receive the score.
interface Props {
  score: number;
}

const CriticScore = ({ score }: Props) => {
  let color = score > 75 ? "green" : score > 60 ? "yellow" : "";
  return (
    // To render the score we use the Badge component in Chakra.
    // can use padding or Chakra's paddingX.
    // colorScheme applies to all foreground, background, borders, shadows etc.
    // color only applies to foreground.
    <Badge colorScheme={color} fontSize="14px" paddingX={2} borderRadius="4px">
      {score}
    </Badge>
  );
};

export default CriticScore;
