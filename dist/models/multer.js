"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
// Create a middleware object to configure the file upload settings
const upload = (0, multer_1.default)({ dest: 'uploads/' });
// Export the middleware object to be used in other parts of the application
exports.default = upload;
