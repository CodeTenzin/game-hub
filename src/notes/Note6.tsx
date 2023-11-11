/*

GIT: Create a custom hook to fetch the games.

Our components should only be responsible for returning markup
and handling user interactions at a high level. 
Our component now knows what type of request it will make and the endpoints.

2 options ot abort requests. 
- move the logic for making the HTTP request inside a service, as we did previously.
- move entire logic (state variables and the useEffect) inside a hook. hooks are
 not just used for sharing functionality but also to seperate converns
 and make timore modular and resuable.

making custom hook to fetch the game. 
Created 'hooks' folder and 'useGames.tsx'

moved the HTTP request logic and the interfaces from GameGrid to useGames.

*/

// BELOW GAMEGRID.TSX
import React, { useEffect, useState } from "react";
import apiClient from "../services/api-client";
import { Text } from "@chakra-ui/react";
import useGames from "../hooks/useGames";

// moved 2 interfaces in 'useGames' hooks since it has the main functionality
// of fetching the games.
/*
// represents the game.
//  check documentation: response -> expand results
interface Game {
  id: number;
  name: string;
}

// represents the response object and its properties.
interface FetchGamesResponse {
  // skipping the other proeprties like 'next' and 'prev'.
  count: number;
  results: Game[];
}
*/

const GameGrid = () => {
  // below moved to our custom hook 'useGames.tsx'
  /*
  // state variable to store our Game object and errors.
  const [games, setGames] = useState<Game[]>([]);
  const [error, setError] = useState("");

  // to send a fetch request to the backend.
  // pass a callback.
  useEffect(() => {
    // tells the shape of the response object, <FetchGamesResponse>
    apiClient
      .get<FetchGamesResponse>("/games")
      // res.data from axios to read the body of the property
      // .count : the property that comes from the API.
      .then((res) => setGames(res.data.results))
      //  above, res.data.results shows compilation error,
      // since we initialized it as an empty array, useState([]).
      // Fix: useState<Game[]>([])
      .catch((err) => setError(err.message));
  });
  // use typescript to create a shape of the response object.
  // check the documentation and see what the response properties are.
  */

  // after moving the logics in the useGames custom hook.
  const { games, error } = useGames();
  // now our compoenent is primarily responsible for returning
  // some HTTP markup.
  // the HTTP request are sperated in our custom hook.

  return (
    <>
      {/* To simulate an invalid error.
        change: .get<FetchGamesResponse>("/games12344554") */}
      {error && <Text>{error}</Text>}
      <ul>
        {games.map((game) => (
          <li key={game.id}>{game.name}</li>
        ))}
      </ul>
    </>
  );
};

export default GameGrid;
