import { MongoClient } from "mongodb";
import { MONGO_URL } from "./consts";

if (!MONGO_URL) {
  throw new Error('Invalid environment variable: "MONGODB_URI"');
}

const uri = MONGO_URL;
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

if (MONGO_URL) {
  throw new Error("Please add your Mongo URI to .env.local");
}

if (process.env.NODE_ENV === "development") {
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(uri, options);
    (global as any)._mongoClientPromise = client.connect();
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
