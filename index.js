import express from 'express'
import cors from 'cors'
import connection from './Database/connection.js';
import userRouter from './Routes/userRouter.js';

const port = process.env.PORT || 4000;

const app = express()
app.use(express.json())
app.use(cors())

app.get("/", (req, res) => {
    res.json({ message: "Server is running correctly and responding well" })
})

app.use("/user", userRouter)

connection.then(() => {
    app.listen(port, () => {
        console.log("Server has been started at port ", port);
    });
}).catch((err) => {
    console.error("Error connecting to MongoDB:", err);
});