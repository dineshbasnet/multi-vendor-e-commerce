import { Response } from "express";
import { IExtendedRequest } from "../../../Middlewares/type";
import Store from "../../../database/models/store.model";
import Cart from "../../../database/models/addtocart.model";

class AddToCartController {
    static async addToCart(req: IExtendedRequest, res: Response) {
        const { productId, item } = req.body
        const storeId = req.storeIdClean?.replace(/_/g, '-')
        const userId = req.user?.id

        if (!productId || !item) {
            return res.status(400).json({
                message: "Provide productId and item "
            })
        }

        const store = await Store.findByPk(storeId)
        if (!store) {
            return res.status(404).json({ message: "store not found" })
        }

        const isExists = await Cart.findOne({ where: { userId, productId, storeId } })
        if (isExists) {
            return res.status(409).json({ message: "Product already exits in cart" })
        }

        const addToCart = await Cart.create({
            productId,
            storeId,
            quantity: item,
            userId
        })

        res.status(201).json({ message: "Product added to cart", addToCart })
    }
}

export default AddToCartController