"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = __importDefault(require("../controllers/authController"));
// create a new express router object to handle authentication routes
const authRoutes = express_1.default.Router();
// define the route to register a new user
authRoutes.post('/register', authController_1.default.register);
// define the route to login an existing user
authRoutes.post('/login', authController_1.default.login);
exports.default = authRoutes;
