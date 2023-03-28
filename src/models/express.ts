// Development
import express from 'express';

// Middleware
import cors from 'cors'; // Cross-origin resource sharing middleware
import helmet from 'helmet'; // Adds extra security headers to the responses

// Routes
import authRoutes from '../routes/authRoutes'; // Import authentication routes
import fileRoutes from '../routes/fileRoutes'; // Import file routes

const app = express(); // Create an instance of the Express application

app.use(express.json()); // Parse incoming request bodies in JSON format
app.use(helmet()); // Use helmet middleware to add extra security headers to the responses
app.use(cors()); // Use cors middleware to enable cross-origin resource sharing

app.use('/auth', authRoutes); // Use authentication routes for endpoints under /auth
app.use('/', fileRoutes); // Use file routes for endpoints under /

export default app; // Export the Express application instance