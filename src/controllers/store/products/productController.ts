import { Request, Response } from "express";
import { IExtendedRequest } from "../../../Middlewares/type";
import sequelize from "../../../database/connection";
import { QueryTypes } from "sequelize";


class ProductController {
    static async createProduct(req: IExtendedRequest, res: Response) {

        const storeIdClean = req.storeIdClean
        const { productName, productDescription, productPrice, stock, categoryId } = req.body

        if (!productName || !productDescription || !productPrice || !stock || !categoryId) {
            return res.status(400).json({
                message: "please provide productName, productDescription, productPrice, stock, categoryId"
            })
        }

        await sequelize.query(`INSERT INTO products_${storeIdClean}(productName,productDescription,productPrice,stock,categoryId)
            VALUES(?,?,?,?,?)`, {
            type: QueryTypes.INSERT,
            replacements: [productName, productDescription, productPrice, stock, categoryId]
        })

        res.status(201).json({
            message: "Product created successfully"
        })


    }

    static async deleteProduct(req: IExtendedRequest, res: Response) {
        const storeIdClean = req.storeIdClean
        const productId = req.params.id

        const productData = await sequelize.query(`SELECT * FROM products_${storeIdClean} WHERE id=?`, {
            type: QueryTypes.SELECT,
            replacements: [productId]
        })

        if (productData.length == 0) {
            return res.status(404).json({
                message: "No products found with that id"
            })
        }

        await sequelize.query(`DELETE * FROM products_${storeIdClean} WHERE id = ?`, {
            type: QueryTypes.DELETE,
            replacements: [productId]
        })

        res.status(200).json({
            message: "Product deleled successfully"
        })


    }

    static async getAllProducts(req: IExtendedRequest, res: Response) {
        const storeIdClean = req.storeIdClean

        const productData = await sequelize.query(`SELECT * FROM products_${storeIdClean}`, {
            type: QueryTypes.SELECT
        })

        res.status(200).json({
            message: "Products fetched successfully",
            datas: productData
        })

    }

    static async getSingleProduct(req: IExtendedRequest, res: Response) {
        const storeIdClean = req.storeIdClean
        const productId = req.params.id
        const product = await sequelize.query(`SELECT * FROM products${storeIdClean} WHERE id = ?`, {
            replacements: [productId],
            type: QueryTypes.SELECT

        })
        res.status(200).json({
            message: "Single product fetched",
            data: product
        })
    }
}

export default ProductController