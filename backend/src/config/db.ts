/*import mongoose, { mongo } from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    throw new Error("MONGO_URI is not defined in the environment variables. ❌")
}

const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(MONGO_URI, {
            dbName: 'tetemeko',
        });
        console.log("✅ MongoDB Connected Successfully");
        
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error)
        process.exit(1)
    }
};

export default connectDB;*/