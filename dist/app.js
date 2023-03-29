"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Load environment variables from .env file
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Import the express app
const express_1 = __importDefault(require("./models/express"));
// Get the port number from the environment variables
const port = process.env.PORT;
// Start the server and listen to incoming requests
express_1.default.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
