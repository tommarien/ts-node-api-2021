import mongodb, { Collection, ObjectId } from 'mongodb';
import env from '../config/env.js';

let mongoClient: mongodb.MongoClient | undefined;

export interface Db {
  productCategories: Collection<ProductCategory>;
}

export interface ProductCategory {
  _id: ObjectId;
  name: string;
  slug: string;
}

function createClient() {
  const uri = env.MONGO_URI;
  if (!uri) throw new Error('No Mongo URI configured (MONGO_URI)');

  mongoClient = new mongodb.MongoClient(uri);

  return mongoClient;
}

export async function connect(): Promise<void> {
  const client = createClient();

  await client.connect();
}

export function getDb(): Db {
  const client = mongoClient;
  if (!client) throw new Error('No Db connected');

  const db = client.db();

  return {
    productCategories: db.collection('productCategories'),
  };
}

export async function disconnect(): Promise<void> {
  if (!mongoClient) return;

  await mongoClient.close();
}
