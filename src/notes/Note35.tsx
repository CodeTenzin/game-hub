// Building for Production
// first we have to build it locally to make sure it doesnt have any errors.
// always easier and faster to discover and fix errors than wait for deployment
// to finish.
/*
Terminal
npm run build
(Note: Note folder temporarily removed. application successfully built, no errors.)
(message says " Some chunks are larger than 500 kBs after minification")
(because our bundle 'index-30d0bc85.js' is over 500kb kilobytes)
(this is a simple app, we dont have any dependency to any unnecessary 3rd pary lbraries.)
(But regardless will discuss is next part of course.)

(we always catch rrors during the build time.)
(simulation: eg: type a wrong method call in any compoents. )
(it will catch the error, this is the beauty of Typescript. )
(before we deploy our applicaiton the TS compiler told us we have a compile time error.)
*/

// Another way to build our applicaiton via command palate
/*
MAC: command+shift+p
Search: 'build' 
select 'Run Build Task'
select 'npm build'
*/

/*
The output of build is a folder 'dist', short for distributable.
All of our js, assests and css files are included in this folder and
what will be deployed for production. 
*/
