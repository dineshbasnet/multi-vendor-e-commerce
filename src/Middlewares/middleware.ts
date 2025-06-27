import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import 'dotenv/config';
import User from "../database/models/user.model";
import { IExtendedRequest } from "./type";




class Middleware {
    static async isLoggedIn(req: IExtendedRequest, res: Response, next: NextFunction): Promise<void> {
        const token = req.headers.authorization
        if (!token) {
            res.status(401).json({ message: "Please provide token" })
            return
        }
        jwt.verify(token, process.env.SECRET_KEY as string, async (error, result: any) => {
            if (error) {
                res.status(401).json({ message: "Invalid Token" })
            } else {
                const userData = await User.findByPk(result.id,{
                    attributes : ['id','email' ]
                })
                if (!userData) {
                    res.status(401).json({ message: "No user with this userId" })
                }
                else {
                    req.user = userData
                    next()

                }
            }
        })
    }

    static restrictTo(req: Request, res: Response) {

    }
}

export default Middleware