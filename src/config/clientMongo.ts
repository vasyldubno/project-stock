import mongoose from "mongoose";

export const clientMongo = async () => {
  const response = await mongoose.connect(
    process.env.NEXT_PUBLIC_MONGODB_URL as string,
    {
      dbName: process.env.NEXT_PUBLIC_MONGODB_DATABASE as string,
    }
  );
  return response;
};
