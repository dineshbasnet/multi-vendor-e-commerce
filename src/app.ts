
import express from 'express'
const app = express()

import authRoute from './routes/global/auth/authRoute'
import storeRoute from './routes/store/storeRoute'
import productStoreRoute from './routes/store/product/productRoute'
import categoryStoreRoute from './routes/store/category/categoryRoute'

app.use(express.json());

app.use("/api",authRoute)
app.use("/api/store",storeRoute)
app.use("/api/store/product",productStoreRoute)
app.use("/api/store/category",categoryStoreRoute)



export default app