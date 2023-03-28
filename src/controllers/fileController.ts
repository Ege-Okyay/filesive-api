import { v4 as uuidv4 } from 'uuid';
import { Request as ExpressRequest, Response } from 'express';
import fs from 'fs/promises';

import prisma from '../models/prisma';

// Define the Request interface, extending the ExpressRequest interface to include an optional `userId` property
interface Request extends ExpressRequest {
  userId?: string
};

const fileController = {
  // Controller function for handling file uploads
  upload: async (req: Request, res: Response) => {
    try {
      // Get the userId from the request
      const userId = req.userId;
  
      // Check if a file was actually uploaded
      if (!req.file) return res.status(400).json('No file uploaded');
  
      // Generate a unique filename using the UUID library
      const fileName = uuidv4();
  
      // Move the uploaded file from the temporary location to a permanent directory
      await fs.rename(req.file.path, `uploads/${fileName}`);
  
      // Create a new file record in the database using the Prisma ORM
      const file = await prisma.file.create({
        data: {
          name: req.file.originalname,
          size: req.file.size,
          path: fileName,
          uploader: {
            connect: {
              id: userId
            }
          }
        },
      });
  
      // Return the newly created file record
      res.send(file);
    }
    catch(err) {
      console.log(err);
      res.sendStatus(500);
    }
  },
  // Controller function for getting all files uploaded by a user
  getAll: async (req: Request, res: Response) => {
    try {
      // Get the userId from the request
      const userId = req.userId;

      // Query the database for all files uploaded by the user
      var allFiles = await prisma.file.findMany({
        where: {
          uploader: {
            id: userId
          }
        }
      });

      // Return the list of files
      res.send(allFiles);
    }
    catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  },
  // Controller function for deleting a file
  delete: async (req: Request, res: Response) => {
    try {
      // Get the userId and fileId from the request
      const userId = req.userId;
      const fileId = req.params.id;
  
      // Query the database for the file to be deleted
      const file = await prisma.file.findUnique({
        where: {
          id: fileId
        }
      });
  
      // If the file doesn't exist, return a 404 error
      if (!file) return res.status(404).send('File not found!');
  
      // If the user is not the uploader of the file, return a 403 error
      if (file.uploaderId !== userId) return res.status(403).send('Unauthorized!');
  
      // Delete the file from the filesystem
      await fs.unlink(`uploads/${file.path}`);
  
      // Delete the file record from the database
      await prisma.file.delete({
        where: {
          id: fileId
        }
      });
  
      // Return a success status code
      res.sendStatus(200);
    }
    catch(err) {
      console.error(err);
      res.sendStatus(500);
    }
  },
  async download(req: Request, res: Response) {
    try {
      const userId = req.userId;
      const fileId = req.params.id;
  
      // Find file with specified id
      const file = await prisma.file.findUnique({
        where: {
          id: fileId
        }
      });
  
      // If file not found, return 404 error
      if (!file) return res.status(404).send('File not found!');
  
      // If file is not shared, check if user is authorized to download it
      if (!file.shared) {
        if (file.uploaderId !== userId) return res.status(403).send('Unauthorized!');
      }
  
      // Download the file
      res.download(`uploads/${file.path}`, file.name);
    }
    catch(err) {
      console.error(err);
      res.sendStatus(500);
    }
  },

  // Share file with specified id
  async share(req: Request, res: Response) {
    try {
      const fileId = req.body.id;

      // Find file with specified id
      const file = await prisma.file.findUnique({
        where: {
          id: fileId
        },
      });

      // If file not found, return 404 error
      if (!file) return res.status(404).send('File not found!');

      // If file is already shared, return 500 error
      if (file.shared) return res.status(500).send('File already shared!');

      // Update file to be shared
      await prisma.file.update({
        where: {
          id: fileId
        },
        data: {
          shared: true
        }
      });

      return res.json(file)
    }
    catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  },

  // Get details of file with specified id
  async getDetails(req: Request, res: Response) {
    try {
      const fileId = req.params.id;

      // Find file with specified id
      const file = await prisma.file.findUnique({
        where: {
          id: fileId
        }
      });

      // If file not found, return 404 error
      if (!file) return res.status(404).send('File not found!');

      // Find uploader of the file
      const uploader = await prisma.user.findUnique({
        where: {
          id: file.uploaderId
        }
      });

      // If uploader not found, return 500 error
      if (!uploader) return res.status(500).send('Uploader not found!');

      // Return uploader and file details
      return res.json({
        uploader: uploader,
        file: file
      });
    }
    catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  }
};

export default fileController;