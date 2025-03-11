import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {

        await mongoose.connect(`${process.env.MONGO_URL}/${DB_NAME}`)

        console.log("MongoDB connected")

    } catch (error) {
        console.log("DB connetion Failed: ", error)
    }
}

export default connectDB