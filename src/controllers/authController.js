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
// Models
const prisma_1 = __importDefault(require("../models/prisma"));
// Middleware
const middleware_1 = __importDefault(require("../middleware/middleware"));
const authController = {
    // Register a new user
    register: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            // Check if email is already in use
            else if ((yield prisma_1.default.user.findFirst({ where: { email: email } })) !== null) {
                return res.json({ class: 'error', msg: 'Email already exists!' });
            }
            // Hash password and create user in database
            const hashedPassword = yield middleware_1.default.hashPassword(password);
            const user = yield prisma_1.default.user.create({
                data: {
                    email: email,
                    password: hashedPassword
                }
            });
            // Create token for new user
            const token = middleware_1.default.createToken(user.id);
            // Return success message with token
            res.json({ class: 'success', msg: token });
        }
        catch (err) {
            console.error(err);
            res.sendStatus(400);
        }
    }),
    // Log in a user
    login: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            // Authenticate user with email and password
            const userId = yield middleware_1.default.authUser(email, password);
            // Check if user ID is in valid format
            const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
            if (regexExp.test(userId) !== true) {
                return res.json({ class: 'error', msg: userId });
            }
            // Create token for authenticated user
            const token = middleware_1.default.createToken(userId);
            // Return success message with token
            res.json({ class: 'success', msg: token });
        }
        catch (err) {
            console.error(err);
            res.sendStatus(401);
        }
    })
};
exports.default = authController;
