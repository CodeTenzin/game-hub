import React from "react";
import { Button, ButtonGroup, Grid, GridItem, Show } from "@chakra-ui/react";

// AT GIT: Build a responsive layout.

// Copy of 'https://rawg.io', mini version of it.
// npm create vite@4.1.0
// name folder
// Framework : React + typescript
// cd folderName
// npm i    installs all dependendies.

// creating git repository.
/*
git init    <-- initlaize the git repository.
git add .   <-- adds all changes to current directory.
git commit -m "Initial commit"   

Now all our files are in the git repository.
As we make changes to the code, we make new commit to version our code. 

Alternative to Bootstrap UI, Material UI, Tailwind.
Using Chakra UI. Look and feel is closer to what we want. 
website: Getting started: choose 'Vite' verison.

npm i @chakra-ui/react @emotion/react @emotion/styled framer-motion
and make these changes to main.tsx
import { ChakraProvider } from '@chakra-ui/react'
<React.StrictMode>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
*/

/*
Added a Chakra UI button to test it.
<Button colorScheme="blue">Button</Button>
can do git add and git commit.
Alternative way in VSCode
"Source Control" tab on the side shows the files and the changes 
that were made.
Once we are ok with the changes
Search bar above: "Install Chakra UI" <-- message that identifies these changes.
select "Commit"
now 2 commits made.

Terminal:
git log --oneline    <-- to see all the commits.
shows the unique id's. 
each commit identifies the changes that we have made to our project.
we can see the chahes that we have made to our project overtime. 
*/

const App = () => {
  return (
    <div>
      {/* used backticks ` ` as we have multiple strings with double quotes. */}
      <Grid
        // templateAreas={`"nav nav"
        //                 "aside main"`}
        // check Chakra UI -> Styled System -> Responsive Styles
        // we want to hide the asdie on mobile devices with single col.
        // define 2 layouts. using an object here.
        templateAreas={{
          base: `"nav" "main"`,
          lg: `"nav nav" "aside main"`, //wider than 1024px
        }}
        // to check how it looks on mobile.
        // Chome Dev Tool -> click the mobile icon.
      >
        <GridItem area="nav" bg="coral">
          Nav
        </GridItem>
        {/* import from chakra. makes sure that 'aside' is removed 
        from screen on smaller views and not show up at the corner. */}
        {/* above="lg" - whats inside is rendered lg screen and above. */}
        <Show above="lg">
          <GridItem area="aside" bg="gold">
            Aside
          </GridItem>
        </Show>
        <GridItem area="main" bg="dodgerblue">
          Main
        </GridItem>
      </Grid>
    </div>
  );
};

export default App;
