import express, { Router } from "express"
import Middleware from "../../../Middlewares/middleware"
import asyncErrorHandler from "../../../services/asyncErrorHandler"
import WishlistController from "../../../controllers/globals/wishlist/wishlistController"



const router:Router = express.Router()

router.route("/").post(Middleware.isLoggedIn,asyncErrorHandler(WishlistController.addToWishlist)).get(Middleware.isLoggedIn,asyncErrorHandler(WishlistController.getUserWishlist))
router.route("/:id").delete(Middleware.isLoggedIn,asyncErrorHandler(WishlistController.removeFromWishlist))

export default router