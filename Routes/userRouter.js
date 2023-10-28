import express from "express"
import userModel from "../Database/userModel.js";
const userRouter = express.Router();


userRouter.get("/", (req, res) => {
    res.json({ message: "userRouter is runnig correctly and responding well" })
})

userRouter.post("/register", async (req, res) => {
    const { name, username, password,email } = req.body
    const userToRegister = new userModel({ name, username, password,email });
    const result = await userToRegister.save()
    res.json(result)
})

export default userRouter;