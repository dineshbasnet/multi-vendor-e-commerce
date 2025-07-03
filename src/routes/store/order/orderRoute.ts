
import express,{Router} from 'express'
import Middleware from '../../../Middlewares/middleware'
import asyncErrorHandler from '../../../services/asyncErrorHandler'
import OrderController from '../../../controllers/store/orders/orderController'

const router:Router = express.Router()

router.route('/').post(Middleware.isLoggedIn,asyncErrorHandler(OrderController.createOrder)).get(Middleware.isLoggedIn,asyncErrorHandler(OrderController.getOrders))


export default router