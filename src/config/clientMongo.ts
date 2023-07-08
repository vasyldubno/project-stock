import mongoose from "mongoose";

export const clientMongo = async () => {
  mongoose.set("strictQuery", false);
  const response = await mongoose.connect(
    process.env.NEXT_PUBLIC_MONGODB_URL as string,
    {
      dbName: process.env.NEXT_PUBLIC_MONGODB_DATABASE as string,
    }
  );
  return response;
};
