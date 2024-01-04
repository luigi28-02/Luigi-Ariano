# Luigi-Ariano
File containing instructions to run the Plant Eaters PWA locally. Before following these steps, ensure you have Node.js, npm, and MongoDB installed.

The steps are as follows:

Clone the project repository from GitHub.

From the terminal of the IDE you're using, enter the following commands:

Navigate to the public directory:

cd public
Install the necessary dependencies:

npm install bcrypt
npm install body-parser
npm install bootstrap
npm install ejs
npm install express
npm install geolib
npm install hbs
npm install leaflet
npm install middleware
npm install mongoose
npm install multer
npm install opencage-api-client
npm install path
Verify that the node_modules folder has appeared inside the public directory.

For the database part, go to the config.js file, and on line 5, you'll find the instruction that connects us to the database. The first part of the passed argument is the host, while the second is the name we give to our database. Once the database is configured and the host appropriately modified with your own, start the config.js file. If "Database connected Successfully" appears in the console, everything went well. Check the database to see if a new database called "User" and two collections exist within it.

At line 351 in the index.js file, you can modify the port to listen on, which is set by default to 3000. Once the index file is started, just click on the link present in the console.

On GitHub, you can find the folder with JSON files to populate the database. For passwords, they're all "abc". You can create an account as both a user and as an activity. Just fill in all the fields.
