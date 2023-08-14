import express, { Request, Response } from "express";
import User from "../models/User";

type UserFunc = (req: Request, res: Response) => void;

export const createUser: UserFunc = async (req, res) => {
  try {
    const user = new User({
      name: "Jack",
      email: "jack@initech.com",
      avatar: "https://i.imgur.com/dM7Thhn.png",
    });

    await user.save();

    res.status(200).json({
      data: user,
    });
  } catch (err) {
    res.status(400).json({
      message: err,
    });
  }
};

export const getUsers: UserFunc = async (req, res) => {
  try {
    const users = await User.find({});
    console.log(users);

    res.status(200).json({
      data: users,
    });
  } catch (err) {
    res.status(400).json({
      messsage: err,
    });
  }
};
