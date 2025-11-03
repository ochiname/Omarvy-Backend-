import express from "express";
import cors from "cors";
import helmet from "helmet";
import router from '../src/router/mother_router';
import session from 'express-session';

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'default_secret_key', // use environment variable in production
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, 
    maxAge: 1000 * 60 * 60 * 24,
   } // set to true if using HTTPS
}));


// Routes
app.get("/", (req, res) => {
  res.send("Hello, TypeScript! chijioke");
});

// Use the router
app.use("/api", router);

export default app;
