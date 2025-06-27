
import express from 'express'
const app = express()

import authRoute from './routes/global/auth/authRoute'
import storeRoute from './routes/store/storeRoute'


app.use(express.json());

app.use("/api",authRoute)
app.use("/api/store",storeRoute)



export default app