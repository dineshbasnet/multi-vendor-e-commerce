
import express,{Router} from 'express'
import Middleware from '../../../Middlewares/middleware'
import asyncErrorHandler from '../../../services/asyncErrorHandler'
import AddToCartController from '../../../controllers/globals/addToCart/cartController'

const router:Router = express.Router()

router.route("/").post(Middleware.isLoggedIn,asyncErrorHandler(AddToCartController.addToCart)).get(Middleware.isLoggedIn,asyncErrorHandler(AddToCartController.getCartItems))
router.route("/:id").delete(Middleware.isLoggedIn,asyncErrorHandler(AddToCartController.removeFromCart)).post(Middleware.isLoggedIn,asyncErrorHandler(AddToCartController.updateQuantity))

export default router