import express from "express"
import userModel from "../Database/userModel.js";
const userRouter = express.Router();
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
import Authorization from "../Authorization.js";
dotenv.config();

userRouter.get("/", (req, res) => {
    res.json({ message: "userRouter is runnig correctly and responding well" })
})

userRouter.get("/getData/:id", async (req, res) => {
    let result = await userModel.findOne({ _id: req.params.id })
    res.json(result)
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

userRouter.post("/add-expense", async (req, res) => {
    const AuthorizationResult = await Authorization(req.body.token)
    console.log(AuthorizationResult);
    if (AuthorizationResult) {
        let User = await userModel.findOne({ _id: req.body._id })
        User.expense.push({ expenseName: req.body.expenseName, expenseCategory: req.body.expenseCategory, expenseAmount: req.body.expenseAmount, date: req.body.date })
        let UpdatedUser = await userModel.findOneAndUpdate({ _id: req.body._id }, User)
        res.status(201).json({ message: "Expense Added" })
    }
    else {
        res.json({ message: "Token error" })
    }
})

userRouter.post("/add-income", async (req, res) => {
    const AuthorizationResult = await Authorization(req.body.token)
    if (AuthorizationResult) {
        let User = await userModel.findOne({ _id: req.body._id })
        User.income.push({ incomeName: req.body.incomeName, incomeAmount: req.body.incomeAmount ,date:req.body.date})
        let UpdatedUser = await userModel.findOneAndUpdate({ _id: req.body._id }, User)
        res.status(201).json({ message: "Income Added" });
    }
    else {
        res.json({ message: "Token error" })
    }
})

userRouter.post("/add-investment", async (req, res) => {
    const AuthorizationResult = await Authorization(req.body.token)
    if (AuthorizationResult) {
        let User = await userModel.findOne({ _id: req.body._id })
        User.investment.push({ investmentName: req.body.investmentName, investmentCategory: req.body.investmentCategory, investedAmount: req.body.investedAmount,date:req.body.date })
        let UpdatedUser = await userModel.findOneAndUpdate({ _id: req.body._id }, User)
        res.status(201).json({ message: "New Investment Added" });
    }
    else {
        res.json({ message: "Token error" })
    }
})

export default userRouter;