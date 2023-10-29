import Jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();
const secreatekey = process.env.Secreat_Key

const Authorization = async (token) => {
    if (!token) {
        console.log("Token Not Matched")
        return false
    }

    const AuthorizationResult = await Jwt.verify(token, secreatekey, async (err, decoded) => {
        if (err) {
            return false
        }
        return true
    })

    return AuthorizationResult
}
export default Authorization;
