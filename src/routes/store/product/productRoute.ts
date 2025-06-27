import express, {Router} from "express"
import Middleware from "../../../Middlewares/middleware"
import asyncErrorHandler from "../../../services/asyncErrorHandler"
import ProductController from "../../../controllers/store/products/productController"

const router: Router = express.Router()

router.route("/").post(Middleware.isLoggedIn,asyncErrorHandler(ProductController.createProduct)).get(Middleware.isLoggedIn,asyncErrorHandler(ProductController.getAllProducts))
router.route("/:id").delete(Middleware.isLoggedIn,asyncErrorHandler(ProductController.deleteProduct)).get(Middleware.isLoggedIn,asyncErrorHandler(ProductController.getSingleProduct))


export default router