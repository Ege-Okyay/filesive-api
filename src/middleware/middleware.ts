import { NextFunction, Response, Request as ExpressRequest } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

import prisma from '../models/prisma';

// Define a secret key to be used for JWT token encryption
const secretKey = process.env.SECRET_KEY || 'secretkey';

// Define a custom interface that extends the ExpressRequest interface
// and adds an optional userId field to it
interface Request extends ExpressRequest {
  userId?: string;
};

// Middleware object that contains several middleware functions
const middleware = {

  // Middleware function to authenticate a user by email and password
  authUser: async (email: string, password: string): Promise<string> => {
    // Find the user with the given email in the database
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    // If no user is found with the given email, return an error message
    if (!user) return 'Invalid email or password!';

    // Compare the given password with the password stored in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // If the passwords do not match, return an error message
    if (!isPasswordValid) return 'Invalid email or password!';

    // If the email and password are valid, return the user's ID
    return user.id;
  },

  // Middleware function to authenticate an incoming request with a JWT token
  authRequest: (req: Request, res: Response, next: NextFunction) => {
    // Get the token from the request's Authorization header
    const token = req.headers.authorization?.split(' ')[1];

    // If no token is found, return a 401 Unauthorized status code
    if (!token) return res.sendStatus(401);

    try {
      // Verify the token's validity using the secret key
      const payload = jwt.verify(token, secretKey);

      // If the token is valid, set the userId field of the request to the decoded user ID
      req.userId = (payload as any).userId;

      // Call the next middleware function in the stack
      next();
    }
    catch(err) {
      console.error(err);
      // If the token is invalid, return a 401 Unauthorized status code
      res.sendStatus(401);
    }
  },

  // Middleware function to hash a password using bcrypt
  hashPassword: (password: string): Promise<string> => {
    return bcrypt.hash(password, 10);
  },

  // Middleware function to create a JWT token using the user's ID and the secret key
  createToken: (userId: string): string => {
    const payload = { userId };
    
    return jwt.sign(payload, secretKey);
  },
};

// Export the middleware object
export default middleware;
