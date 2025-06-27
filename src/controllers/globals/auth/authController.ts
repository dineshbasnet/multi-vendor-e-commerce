import { Request, Response } from "express";
import User from "../../../database/models/user.model";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";


class AuthController {
    static async registerUser(req: Request, res: Response) {
        if (req.body == undefined) {
            return res.status(400).json({
                message: "No data was sent"
            })
        }
        const { username, email, password } = req.body
        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Please provide username, email, password"

            })
        }
        const [data] = await User.findAll({
            where: { email }
        })
        if (data) {
            return res.status(400).json({
                message: "User already exists."
            })
        }
        await User.create({
            username: username,
            email: email,
            password: bcrypt.hashSync(password, 12)
        })

        res.status(201).json({
            message: "user registered successfully"
        })

    }

    static async loginUser(req: Request, res: Response) {
        const { email, password } = req.body
        if (!email || !password) {
            res.status(400).json({ message: "Please provide email,password" })
            return
        }

        const [data] = await User.findAll({
            where: {
                email
            }
        })
        if (!data) {
            return res.status(404).json({
                message: "Invalid email or password"
            })
        }

        const isPasswordMatch = bcrypt.compareSync(password, data.password)

        if (isPasswordMatch) {
            const token = jwt.sign({ id: data.id }, process.env.SECRET_KEY !,{
                expiresIn: "1d"
            })
            res.status(201).json({
                message: "Login successfully",
                token
            })

        }
        else {
            res.status(403).json({ message: "Invalid email or password" })
        }
    }
}
export default AuthController