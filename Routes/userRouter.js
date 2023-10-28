import express from "express"
const userRouter = express.Router();


userRouter.get("/", (req, res) => {
    res.json({ message: "userRouter is runnig correctly and responding well" })
})


export default userRouter;