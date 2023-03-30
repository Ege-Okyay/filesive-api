// Development
import { Request, Response } from "express";
import validator from 'validator';

// Models
import prisma from "../models/prisma";

// Middleware
import middleware from "../middleware/middleware";

const authController = {
  // Register a new user
  register: async (req: Request, res: Response) => {
    try {
      const { email, password, confirmPassword } = req.body;

      // Check if required fields are filled out
      if (!email || !password || !confirmPassword) {
        return res.json({ class: 'error', msg: 'Invalid information!' });
      }

      // Check if password and confirmation match
      if (password !== confirmPassword) {
        return res.json({ class: 'error', msg: 'Passwords do not match!' });
      }

      // Check if email is valid
      if (!validator.isEmail(email)) {
        return res.json({ class: 'error', msg: 'Invalid email format!' });
      }
      
      // Check if email is already in use
      if (await prisma.user.findFirst({ where: { email: email } }) !== null) {
        return res.json({ class: 'error', msg: 'Email already exists!' });
      }

      // Hash password and create user in database
      const hashedPassword = await middleware.hashPassword(password);
      const user = await prisma.user.create({
        data: {
          email: email,
          password: hashedPassword
        }
      });
      // Create token for new user
      const token = middleware.createToken(user.id);

      // Return success message with token
      res.json({ class: 'success', msg: token });
    }
    catch (err) {
      console.error(err);
      res.sendStatus(400);
    }
  },
  // Log in a user
  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      // Authenticate user with email and password
      const userId = await middleware.authUser(email, password);

      // Check if user ID is in valid format
      const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
      if (regexExp.test(userId) !== true) {
        return res.json({ class: 'error', msg: userId });
      }

      // Create token for authenticated user
      const token = middleware.createToken(userId);

      // Return success message with token
      res.json({ class: 'success', msg: token });
    }
    catch(err) {
      console.error(err);
      res.sendStatus(401);
    }
  }
}

export default authController;