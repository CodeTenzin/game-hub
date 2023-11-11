//GIT: Get optimized images

// CREATE 'IMAGE-URL.TS' IN SERVIVE FOLDER
// changes in GameCards.tsx

/*
The Game images are big.
loading it on a slow network can take time.
optimizing image to speed the page load.

Network -> Images -> Copy image URL
we can corp images by manipulating the URL which the API allows.
Original: https://media.rawg.io/media/games/20a/20aa03a10cda45239fe22d035c0ebe64.jpg
putting '/crop/600/400' after media. 600 by 400 pixels.
https://media.rawg.io/media/crop/600/400/games/20a/20aa03a10cda45239fe22d035c0ebe64.jpg
To render optimized images we modigy the image url.
dont want this functionality inside the GameCard.tsx. 
CREATE A UTULITY FIKE INSDIE SERVICE FOR THAT.
'IMAGE-URL.TS'

END: Network -> Images -> Copy image URL
to check the modified url of the image.
*/

//GAMECARDS.TSX
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
    <Card borderRadius={10} overflow="hidden">
      {/* <Image src={game.background_image} /> */}
      {/* pass the image as an argument. */}
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
