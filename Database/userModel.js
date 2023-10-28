import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
    name: String,
    email:String,
    username: String,
    password: String
})

const userModel = mongoose.model("users",userSchema)
export default userModel;