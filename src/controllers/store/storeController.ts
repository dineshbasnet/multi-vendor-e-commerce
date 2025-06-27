import { NextFunction, Request, Response } from "express";
import sequelize from "../../database/connection";
import { nanoid } from 'nanoid';
import User from "../../database/models/user.model";
import { IExtendedRequest } from "../../Middlewares/type";
import Store from "../../database/models/store.model";



class StoreController {
    static async createStore(req: IExtendedRequest, res: Response, next: NextFunction) {
        const { storeName, storePhoneNumber, storeAddress } = req.body
        const storePanNo = req.body.storePanNo || null
        const storeVatNo = req.body.storeVatNo || null
        const storeCode = nanoid(8);

        console.log(nanoid)

        if (!storeName || !storePhoneNumber || !storeAddress) {
            return res.status(400).json({
                message: "Please provide storeName,storePhoneNumber,storeAddress"
            })
        }

        const store = await Store.create({
            storeName: storeName,
            storePhoneNumber: storePhoneNumber,
            storeAddress: storeAddress,
            storePanNo: storePanNo,
            storeVatNo: storeVatNo,
            userId: req.user?.id,
            storeCode: storeCode
        })

        const storeIdClean = store.id.replace(/-/g, '_');


        await User.update({
            role: 'store'
        }, {
            where: {
                id: req.user?.id
            }
        })
        req.storeIdClean = storeIdClean
        next()
    }

    static async createProduct(req: IExtendedRequest, res: Response, next: NextFunction) {

        const storeIdClean = req.storeIdClean


        await sequelize.query(`CREATE TABLE IF NOT EXISTS products_${storeIdClean}(
            id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
            productName VARCHAR(255) NOT NULL,
            productDescription TEXT,
            productPrice DECIMAL(10, 2) NOT NULL,
            stock INTEGER DEFAULT 0,
            categoryId VARCHAR(36) NOT NULL REFERENCES category_${storeIdClean} (id),
            productImage VARCHAR(255),
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )`)

        next()
    }

    static async createCategory(req: IExtendedRequest, res: Response, next: NextFunction) {
        const storeIdClean = req.storeIdClean

        await sequelize.query(`CREATE TABLE IF NOT EXISTS category_${storeIdClean}(
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        categoryName VARCHAR(100) NOT NULL, 
        categoryDescription TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )`)

        next()
    }

    static async createOrders(req: IExtendedRequest, res: Response, next: NextFunction) {
        const storeIdClean = req.storeIdClean

        await sequelize.query(`
        CREATE TABLE IF NOT EXISTS orders_${storeIdClean} (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        customerName VARCHAR(100),
        customerPhone VARCHAR(20),
        totalAmount DECIMAL(10,2),
        status VARCHAR(50) DEFAULT 'pending',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

        await sequelize.query(`
        CREATE TABLE IF NOT EXISTS order_items_${storeIdClean} (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        orderId VARCHAR(36),
        productId VARCHAR(36),
        quantity INT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (orderId) REFERENCES orders_${storeIdClean}(id),
        FOREIGN KEY (productId) REFERENCES products_${storeIdClean}(id)
      )
    `);
        next()



    }
    static async createPaymentTable(req: IExtendedRequest, res: Response) {
        const storeIdClean = req.storeIdClean;

        await sequelize.query(`
        CREATE TABLE IF NOT EXISTS payments_${storeIdClean} (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        orderId VARCHAR(36) NOT NULL,
        paymentMethod VARCHAR(50) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'completed',
        transactionId VARCHAR(100),
        paidAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (orderId) REFERENCES orders_${storeIdClean}(id)
      )
    `);

        return res.status(201).json({
            message: "Store and all related tables created successfully",
            storeId: storeIdClean,
        });
    }
}

export default StoreController