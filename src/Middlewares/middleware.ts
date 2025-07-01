import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";
import User from "../database/models/user.model";
import Store from "../database/models/store.model"; 
import { IExtendedRequest } from "./type";

class Middleware {
    static async isLoggedIn(req: IExtendedRequest, res: Response, next: NextFunction): Promise<void> {
        const token = req.headers.authorization;

        if (!token) {
            res.status(401).json({ message: "Please provide token" });
            return;
        }

        jwt.verify(token, process.env.SECRET_KEY as string, async (error, result: any) => {
            if (error) {
                return res.status(401).json({ message: "Invalid Token" });
            }

            const userData = await User.findByPk(result.id, {
                attributes: ["id", "email"]
            });

            if (!userData) {
                return res.status(401).json({ message: "No user with this userId" });
            }

            req.user = userData;

            const store = await Store.findOne({
                where: { userId: userData.id },
                attributes: ["id"]
            });

            if (store) {
                req.storeIdClean = store.id.replace(/-/g, "_");
            }

            next();
        });
    }

    static restrictTo(req: Request, res: Response) {
        // You can use this for role-based authorization
    }
}

export default Middleware;
