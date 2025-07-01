
import express,{Router} from 'express'
import Middleware from '../../../Middlewares/middleware'

const router:Router = express.Router()

router.route('/').post(Middleware.isLoggedIn)

export default router