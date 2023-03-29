"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const promises_1 = __importDefault(require("fs/promises"));
const prisma_1 = __importDefault(require("../models/prisma"));
;
const fileController = {
    // Controller function for handling file uploads
    upload: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Get the userId from the request
            const userId = req.userId;
            // Check if a file was actually uploaded
            if (!req.file)
                return res.status(400).json('No file uploaded');
            // Generate a unique filename using the UUID library
            const fileName = (0, uuid_1.v4)();
            // Move the uploaded file from the temporary location to a permanent directory
            yield promises_1.default.rename(req.file.path, `uploads/${fileName}`);
            // Create a new file record in the database using the Prisma ORM
            const file = yield prisma_1.default.file.create({
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
        catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    }),
    // Controller function for getting all files uploaded by a user
    getAll: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Get the userId from the request
            const userId = req.userId;
            // Query the database for all files uploaded by the user
            var allFiles = yield prisma_1.default.file.findMany({
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
    }),
    // Controller function for deleting a file
    delete: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Get the userId and fileId from the request
            const userId = req.userId;
            const fileId = req.params.id;
            // Query the database for the file to be deleted
            const file = yield prisma_1.default.file.findUnique({
                where: {
                    id: fileId
                }
            });
            // If the file doesn't exist, return a 404 error
            if (!file)
                return res.status(404).send('File not found!');
            // If the user is not the uploader of the file, return a 403 error
            if (file.uploaderId !== userId)
                return res.status(403).send('Unauthorized!');
            // Delete the file from the filesystem
            yield promises_1.default.unlink(`uploads/${file.path}`);
            // Delete the file record from the database
            yield prisma_1.default.file.delete({
                where: {
                    id: fileId
                }
            });
            // Return a success status code
            res.sendStatus(200);
        }
        catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    }),
    download(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId;
                const fileId = req.params.id;
                // Find file with specified id
                const file = yield prisma_1.default.file.findUnique({
                    where: {
                        id: fileId
                    }
                });
                // If file not found, return 404 error
                if (!file)
                    return res.status(404).send('File not found!');
                // If file is not shared, check if user is authorized to download it
                if (!file.shared) {
                    if (file.uploaderId !== userId)
                        return res.status(403).send('Unauthorized!');
                }
                // Download the file
                res.download(`uploads/${file.path}`, file.name);
            }
            catch (err) {
                console.error(err);
                res.sendStatus(500);
            }
        });
    },
    // Share file with specified id
    share(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fileId = req.body.id;
                // Find file with specified id
                const file = yield prisma_1.default.file.findUnique({
                    where: {
                        id: fileId
                    },
                });
                // If file not found, return 404 error
                if (!file)
                    return res.status(404).send('File not found!');
                // If file is already shared, return 500 error
                if (file.shared)
                    return res.status(500).send('File already shared!');
                // Update file to be shared
                yield prisma_1.default.file.update({
                    where: {
                        id: fileId
                    },
                    data: {
                        shared: true
                    }
                });
                return res.json(file);
            }
            catch (err) {
                console.error(err);
                res.sendStatus(500);
            }
        });
    },
    // Get details of file with specified id
    getDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fileId = req.params.id;
                // Find file with specified id
                const file = yield prisma_1.default.file.findUnique({
                    where: {
                        id: fileId
                    }
                });
                // If file not found, return 404 error
                if (!file)
                    return res.status(404).send('File not found!');
                // Find uploader of the file
                const uploader = yield prisma_1.default.user.findUnique({
                    where: {
                        id: file.uploaderId
                    }
                });
                // If uploader not found, return 500 error
                if (!uploader)
                    return res.status(500).send('Uploader not found!');
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
        });
    }
};
exports.default = fileController;
