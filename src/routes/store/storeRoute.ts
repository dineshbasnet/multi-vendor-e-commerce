import express, { Router } from "express"
import Middleware from "../../Middlewares/middleware"
import asyncErrorHandler from "../../services/asyncErrorHandler"
import StoreController from "../../controllers/store/storeController"


const router:Router = express.Router()

router.route("/").post(Middleware.isLoggedIn,asyncErrorHandler(StoreController.createStore))

export default router