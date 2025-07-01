import express,{Router} from 'express'
import Middleware from '../../../Middlewares/middleware'
import asyncErrorHandler from '../../../services/asyncErrorHandler'
import CategoryController from '../../../controllers/store/category/categoryController'

const router: Router = express.Router()

router.route("/").post(Middleware.isLoggedIn,asyncErrorHandler(CategoryController.createCategory)).get(Middleware.isLoggedIn,asyncErrorHandler(CategoryController.getCategories))
router.route("/:id").delete(Middleware.isLoggedIn,asyncErrorHandler(CategoryController.deleteCategory))


export default router