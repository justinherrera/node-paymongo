import express, { Request, Response } from "express";
import { config } from "../controllers/AuthController";
const { auth } = require("express-openid-connect");
const { requiresAuth } = require("express-openid-connect");

interface ServerRequest extends Request {
  oidc: {
    isAuthenticated: () => void;
    user: string;
  };
}

const router = express.Router();

// router.get("/", getUser);

// auth router attaches /login, /logout, and /callback routes to the baseURL
router.use(auth(config));

// req.isAuthenticated is provided from the auth router
// router.get("/", (req: Request, res: Response) => {
//   res.send(req.oidc.isAuthenticated() ? "Logged in" : "Logged out");
// });

// router.get("/profile", requiresAuth(), (req: Request, res: Response) => {
//   res.send(JSON.stringify(req.oidc.user));
// });

export default router;
