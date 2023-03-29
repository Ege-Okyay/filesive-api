"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Import the PrismaClient class from the @prisma/client package
const client_1 = require("@prisma/client");
// Create a new instance of PrismaClient
const prisma = new client_1.PrismaClient();
// Export the PrismaClient instance as the default export of this module
exports.default = prisma;
