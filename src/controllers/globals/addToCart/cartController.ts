import { Response } from "express";
import { IExtendedRequest } from "../../../Middlewares/type";
import Store from "../../../database/models/store.model";
import Cart from "../../../database/models/addtocart.model";
import sequelize from "../../../database/connection";

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

    static async getCartItems(req: IExtendedRequest, res: Response) {

        const userId = req.user?.id;

        const cartItems = await Cart.findAll({ where: { userId }, raw: true });

        // Fetch product info manually per item
        const itemsWithDetails = await Promise.all(
            cartItems.map(async (item) => {
                const storeIdClean = item.storeId.replace(/-/g, '_');
                const [products] = await sequelize.query(`
          SELECT productName, productPrice, productImage FROM products_${storeIdClean}
          WHERE id = '${item.productId}'
        `);
                return {
                    ...item,
                    product: products[0] || null,
                };
            })
        );

        return res.status(200).json({ cart: itemsWithDetails });

    }

    static async removeFromCart(req: IExtendedRequest, res: Response) {
        const cartItemId = req.params.id
        const userId = req.user?.id

        const item = await Cart.findOne({ where: { id: cartItemId, userId } })

        if (!item) {
            return res.status(404).json({ message: "Cart item not found" })
        }

        await item.destroy();

        res.json({ message: "Removed from Cart" })
    }
    
      static async updateQuantity(req: IExtendedRequest, res: Response) {
    const id = req.params.id;
    const { item } = req.body;

    
      const cart = await Cart.findByPk(id);
      if (!cart) {
        return res.status(404).json({ message: "Cart item not found" });
      }

      cart.quantity = item;
      await cart.save();

      return res.status(200).json({ message: "Quantity updated" });
   
  }
}

export default AddToCartController