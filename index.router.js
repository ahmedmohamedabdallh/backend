import connectDB from './db/connectDB.js'
import userRoutes from "./routes/userRoutes.js"
import postRoutes from "./routes/postRoutes.js"
import messageRoutes from "./routes/messageRoutes.js"

const initApp = (app, express) => {
    //convert Buffer Data
    app.use(express.json({}))
    //Setup API Routing 
    app.use(`/api/users`, userRoutes)
    app.use(`/posts`, postRoutes)
    app.use(`/messages`, messageRoutes)
    app.all('*', (req, res, next) => {
        res.send("In-valid Routing Plz check url  or  method")
    })
    connectDB()

}



export default initApp