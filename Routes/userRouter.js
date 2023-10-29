import express from "express"
import userModel from "../Database/userModel.js";
const userRouter = express.Router();
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();

userRouter.get("/", (req, res) => {
    res.json({ message: "userRouter is runnig correctly and responding well" })
})

userRouter.post("/register", async (req, res) => {
    let { name, username, password, email } = req.body
    bcrypt.hash(password, 10, async (err, hash) => {
        if (err) {
            console.error(err);
            res.json({ message: "Error Hashing Password" })
            return null
        }
        password = hash
        const userToRegister = new userModel({ name, username, password, email });
        const result = await userToRegister.save()
        res.json(result)
    })
})
userRouter.post("/login", async (req, res) => {
    if (req.body.username && req.body.password) {
        let userToLogin = await userModel.findOne({ username: req.body.username })
        if (userToLogin) {
            bcrypt.compare(req.body.password, userToLogin.password, (err, result) => {
                if (err || !result) {
                    res.json({ message: "Password Incorrect" });
                }
                else {
                    const payload = { _id: userToLogin._id }
                    const token = jwt.sign(payload, process.env.Secreat_Key, { expiresIn: "300s" })
                    res.json({ userToLogin, token })
                }
            })
        }
        else {
            res.json({ message: "No User Found" });
        }
    }
})

export default userRouter;