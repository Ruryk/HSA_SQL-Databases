import express from "express";
import bodyParser from "body-parser";
import { connectWithRetry } from "./services/dbService.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Routes
app.use("/users", userRoutes);

// Start server
connectWithRetry((connection) => {
    app.locals.connection = connection;
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
});
