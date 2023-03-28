import express from 'express';
import authController from '../controllers/authController';

// create a new express router object to handle authentication routes
const authRoutes = express.Router();

// define the route to register a new user
authRoutes.post('/register', authController.register);

// define the route to login an existing user
authRoutes.post('/login', authController.login);

export default authRoutes;