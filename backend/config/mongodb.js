import mongoose from 'mongoose'

export const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => {
            console.log("DATABASE CONNECTED SUCCESSFULLY");
        });
        await mongoose.connect(`${process.env.MONGODB_URL}/mern-auth`)
    } catch (error) {
        console.log("DATABASE CONNECTION ERROR :: ", error);
    }
}