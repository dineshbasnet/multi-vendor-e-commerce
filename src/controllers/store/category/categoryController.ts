import { Response } from "express";
import { IExtendedRequest } from "../../../Middlewares/type";
import sequelize from "../../../database/connection";
import { QueryTypes } from "sequelize";

class CategoryController {
    static async createCategory(req: IExtendedRequest, res: Response) {
        const storeIdClean = req.storeIdClean
        const { categoryName, categoryDescription } = req.body
        if (!categoryName || !categoryDescription) {
            return res.status(400).json({
                message: "Please provide categoryName, categoryDescription"
            })
        }

        await sequelize.query(`INSERT INTO category_${storeIdClean}(categoryName,categoryDescription) VALUES(?,?)`, {
            type: QueryTypes.INSERT,
            replacements: [categoryName, categoryDescription]
        })

        res.json({
            message: "Category created successfully"
        })
    }

    static async deleteCategory(req: IExtendedRequest, res: Response) {
        const categoryId = req.params.id
        const storeIdClean = req.storeIdClean

        const categoryData = await sequelize.query(`SELECT * FROM category_${storeIdClean} WHERE id = ?`, {
            type: QueryTypes.SELECT,
            replacements: [categoryId]
        })

        if (categoryData.length == 0) {
            return res.status(404).json({
                message: "No category found "
            })
        }

        await sequelize.query(`DELETE * FROM category_${storeIdClean} WHERE id = ?`, {
            type: QueryTypes.DELETE,
            replacements: [categoryId]
        })

        res.status(200).json({
            message: "Category deleted successfully"
        })

    }

    static async getCategories(req: IExtendedRequest, res: Response) {
        const storeId = req.storeIdClean

        const categoryData = await sequelize.query(`SELECT * FROM category_${storeId}`, {
            type: QueryTypes.SELECT
        })

        res.status(200).json({
            message: "categories fetched successfully",
            datas: categoryData
        })
    }
}

export default CategoryController