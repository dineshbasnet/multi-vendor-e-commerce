import { Response } from "express";
import { IExtendedRequest } from "../../../Middlewares/type";


class OrderController{
    static async createOrder(req:IExtendedRequest,res:Response){
        const userId = req.user?.id


    }
}

export default OrderController