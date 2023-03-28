"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("../models/multer"));
const middleware_1 = __importDefault(require("../middleware/middleware"));
const fileController_1 = __importDefault(require("../controllers/fileController"));
// create an instance of Router class from Express.js
const fileRoutes = express_1.default.Router();
fileRoutes.post('/upload-file', middleware_1.default.authRequest, multer_1.default.single('file'), fileController_1.default.upload);
fileRoutes.post('/share-file', middleware_1.default.authRequest, fileController_1.default.share);
fileRoutes.delete('/delete-file/:id', middleware_1.default.authRequest, fileController_1.default.delete);
fileRoutes.get('/all-files', middleware_1.default.authRequest, fileController_1.default.getAll);
fileRoutes.get('/download-file/:id', middleware_1.default.authRequest, fileController_1.default.download);
fileRoutes.get('/get-details/:id', middleware_1.default.authRequest, fileController_1.default.getDetails);
// export the router
exports.default = fileRoutes;
