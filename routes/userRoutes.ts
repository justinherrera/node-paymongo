import express, { Request, Response } from "express";
import { createUser, getUsers } from "../controllers/UserController";

const router = express.Router();

router.post("/", createUser).get("/", getUsers);

export default router;
