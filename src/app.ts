// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

// Import the express app
import app from './models/express';

// Get the port number from the environment variables
const port = process.env.PORT;

// Start the server and listen to incoming requests
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});