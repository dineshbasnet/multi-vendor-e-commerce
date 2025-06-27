import 'dotenv/config'
import { Sequelize } from 'sequelize-typescript'

const sequelize = new Sequelize({
    database: process.env.DB_NAME, // database ko name 
    username: process.env.DB_USERNAME, // database ko username, by default root
    password: process.env.DB_PASSWORD,  // database ko password, by default ""
    host: process.env.DB_HOST, // database ko location, kaha xa vanne kura, localhost(mycomputer)
    dialect: "mysql", // k database use garna aateko vanne kura, 
    port: Number(process.env.DB_PORT),
    models: [__dirname + '/models']

})

sequelize.authenticate()
    .then(() => {
        console.log("Authenticated, connection established")
    })
    .catch((error) => {
        console.log(error)
    })

sequelize.sync({ alter: false })
    .then(() => {
        console.log("migrated successfully new changes")
    })


export default sequelize;