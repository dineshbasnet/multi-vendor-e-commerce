import { Request, Response } from "express";
import sequelize from "../../../database/connection";
import { QueryTypes } from "sequelize";
import Wishlist from "../../../database/models/wishlist.model"
import Store from "../../../database/models/store.model";
import { IExtendedRequest } from "../../../Middlewares/type";

class WishlistController {
    // Add product to wishlist

    static async addToWishlist(req: IExtendedRequest, res: Response) {

        const { productId } = req.body;
        const storeId = req.storeIdClean?.replace(/_/g, '-')
        const userId = req.user?.id

        if (!productId) {
            return res.status(400).json({ message: "productId is required" });
        }
        const store = await Store.findByPk(storeId);
        if (!store) {
            return res.status(404).json({ message: "Store not found" });
        }

        
        const exists = await Wishlist.findOne({ where: { userId, productId, storeId } });
        if (exists) {
            return res.status(409).json({ message: "Product already in wishlist" });
        }

        const wishlist = await Wishlist.create({
            userId,
            productId,
            storeId
        });

        return res.status(201).json({ message: "Product added to wishlist", wishlist });

    }

    // Get all wishlist items with product details
    static async getUserWishlist(req: IExtendedRequest, res: Response) {
        try {
            const userId = req.user?.id;

            const items = await Wishlist.findAll({ where: { userId } });

            const enrichedWishlist = await Promise.all(
                items.map(async (item: any) => {
                    const storeIdClean = item.storeId.replace(/-/g, "_");
                    const [product] = await sequelize.query(
                        `SELECT * FROM products_${storeIdClean} WHERE id = :productId`,
                        {
                            replacements: { productId: item.productId },
                            type: QueryTypes.SELECT,
                        }
                    );

                    return {
                        id: item.id,
                        storeId: item.storeId,
                        productId: item.productId,
                        product,
                    };
                })
            );

            res.json({ data: enrichedWishlist });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Error fetching wishlist" });
        }
    }

    // Remove item from wishlist
    static async removeFromWishlist(req: IExtendedRequest, res: Response) {
        
            const  wishlistId  = req.params.id;
            const userId = req.user?.id;

            const item = await Wishlist.findOne({ where: { id: wishlistId, userId } });

            if (!item) {
                return res.status(404).json({ message: "Wishlist item not found" });
            }

            await item.destroy();

            res.json({ message: "Removed from wishlist" });
      
    }
}

export default WishlistController;
