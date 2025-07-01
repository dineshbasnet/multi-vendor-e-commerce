
import express,{Router} from 'express'
import Middleware from '../../../Middlewares/middleware'
import asyncErrorHandler from '../../../services/asyncErrorHandler'
import AddToCartController from '../../../controllers/globals/addToCart/addtocartController'

const router:Router = express.Router()

router.route("/").post(Middleware.isLoggedIn,asyncErrorHandler(AddToCartController.addToCart))

export default router