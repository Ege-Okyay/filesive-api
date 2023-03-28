import express from 'express';
import upload from '../models/multer';
import middleware from '../middleware/middleware';
import fileController from '../controllers/fileController';

// create an instance of Router class from Express.js
const fileRoutes = express.Router();

fileRoutes.post('/upload-file', middleware.authRequest, upload.single('file'), fileController.upload);
fileRoutes.post('/share-file', middleware.authRequest, fileController.share);

fileRoutes.delete('/delete-file/:id', middleware.authRequest, fileController.delete);

fileRoutes.get('/all-files', middleware.authRequest, fileController.getAll);
fileRoutes.get('/download-file/:id', middleware.authRequest, fileController.download);
fileRoutes.get('/get-details/:id', middleware.authRequest, fileController.getDetails);

// export the router
export default fileRoutes;