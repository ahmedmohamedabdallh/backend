import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, './.env') })
import express from 'express'
import initApp from './index.router.js'
const app = express()
// setup port and the baseUrl
const port = process.env.PORT || 5000
initApp(app ,express)
app.listen(port, () => console.log(`Example app listening on port ${port}!`))