
import express from 'express'
const app = express()

import authRoute from './routes/global/auth/authRoute'
import storeRoute from './routes/store/storeRoute'
import productStoreRoute from './routes/store/product/productRoute'
import categoryStoreRoute from './routes/store/category/categoryRoute'
import wishlistRoute from './routes/global/wishlist/wishlistRoute'
import addtocartRoute from './routes/global/addToCart/addTocartRoute'
import orderRoute from './routes/store/order/orderRoute'

app.use(express.json());

//Authentication routes
app.use("/api",authRoute)

//store routes
app.use("/api/store",storeRoute)
app.use("/api/store/product",productStoreRoute)
app.use("/api/store/category",categoryStoreRoute)

app.use("/api/globals/wishlist",wishlistRoute)
app.use("/api/globals/cart",addtocartRoute)
app.use("/api/store/order",orderRoute)



export default app