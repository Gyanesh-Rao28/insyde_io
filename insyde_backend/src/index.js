import dotenv from 'dotenv';
import connectDB from './db/index.js';
import { app } from './app.js';

dotenv.config({
    path: './env'
})


// MongoDB Connection

connectDB()
    .then(() => {
        const PORT = process.env.PORT || 3000

        app.on("error", (error) => {
            console.log(error)
            throw error
        })

        app.listen(PORT, () => {
            console.log("Running on", PORT)
        })
    })
    .catch((err) => { console.log("DB Connection failed", err) })


