import mongoose from 'mongoose';

export const connectDB = () => {
        mongoose.connect( process.env.NEXT_PUBLIC_API_MongodB_Url!  ,{dbName:"beyondchats"}).then(() => {
            console.log("Connected to MongoDB");
        }).catch((err) => {
            console.log(err);
        });
}