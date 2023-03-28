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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const prisma_1 = __importDefault(require("../models/prisma"));
// Define a secret key to be used for JWT token encryption
const secretKey = process.env.SECRET_KEY || 'secretkey';
;
// Middleware object that contains several middleware functions
const middleware = {
    // Middleware function to authenticate a user by email and password
    authUser: (email, password) => __awaiter(void 0, void 0, void 0, function* () {
        // Find the user with the given email in the database
        const user = yield prisma_1.default.user.findUnique({
            where: {
                email: email,
            },
        });
        // If no user is found with the given email, return an error message
        if (!user)
            return 'Invalid email or password!';
        // Compare the given password with the password stored in the database
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        // If the passwords do not match, return an error message
        if (!isPasswordValid)
            return 'Invalid email or password!';
        // If the email and password are valid, return the user's ID
        return user.id;
    }),
    // Middleware function to authenticate an incoming request with a JWT token
    authRequest: (req, res, next) => {
        var _a;
        // Get the token from the request's Authorization header
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        // If no token is found, return a 401 Unauthorized status code
        if (!token)
            return res.sendStatus(401);
        try {
            // Verify the token's validity using the secret key
            const payload = jsonwebtoken_1.default.verify(token, secretKey);
            // If the token is valid, set the userId field of the request to the decoded user ID
            req.userId = payload.userId;
            // Call the next middleware function in the stack
            next();
        }
        catch (err) {
            console.error(err);
            // If the token is invalid, return a 401 Unauthorized status code
            res.sendStatus(401);
        }
    },
    // Middleware function to hash a password using bcrypt
    hashPassword: (password) => {
        return bcrypt_1.default.hash(password, 10);
    },
    // Middleware function to create a JWT token using the user's ID and the secret key
    createToken: (userId) => {
        const payload = { userId };
        return jsonwebtoken_1.default.sign(payload, secretKey);
    },
};
// Export the middleware object
exports.default = middleware;
