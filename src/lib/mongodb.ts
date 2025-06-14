// src/lib/mongodb.ts
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = "sunday_school";

if (!uri) {
  throw new Error("MONGODB_URI is not defined in .env.local");
}

if (!uri.startsWith("mongodb://") && !uri.startsWith("mongodb+srv://")) {
  throw new Error(
    'MONGODB_URI must start with "mongodb://" or "mongodb+srv://"'
  );
}

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient>;

declare global {
  // Extend NodeJS.Global to include _mongoClientPromise
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
  // In development, use a global variable to preserve the client instance across hot reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, create a new client instance
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function getDb() {
  try {
    const client = await clientPromise;
    return client.db(dbName);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to connect to MongoDB: ${error.message}`);
    } else {
      throw new Error("Failed to connect to MongoDB: Unknown error");
    }
  }
}
