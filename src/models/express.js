"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Development
const express_1 = __importDefault(require("express"));
// Middleware
const cors_1 = __importDefault(require("cors")); // Cross-origin resource sharing middleware
const helmet_1 = __importDefault(require("helmet")); // Adds extra security headers to the responses
// Routes
const authRoutes_1 = __importDefault(require("../routes/authRoutes")); // Import authentication routes
const fileRoutes_1 = __importDefault(require("../routes/fileRoutes")); // Import file routes
const app = (0, express_1.default)(); // Create an instance of the Express application
app.use(express_1.default.json()); // Parse incoming request bodies in JSON format
app.use((0, helmet_1.default)()); // Use helmet middleware to add extra security headers to the responses
app.use((0, cors_1.default)()); // Use cors middleware to enable cross-origin resource sharing
app.use('/auth', authRoutes_1.default); // Use authentication routes for endpoints under /auth
app.use('/', fileRoutes_1.default); // Use file routes for endpoints under /
exports.default = app; // Export the Express application instance
