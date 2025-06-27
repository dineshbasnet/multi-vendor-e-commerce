import app from './src/app'
import { config } from 'dotenv'
config()

import './src/database/connection'

function startServer(){
    const port = process.env.PORT || 4000
    app.listen(port,function(){
        console.log(`Server start at port ${port}`)
    })
}

startServer()