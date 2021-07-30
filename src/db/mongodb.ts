import mongodb, { Collection, ObjectId } from 'mongodb';
import config from '../config.js';

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
  const { uri } = config.mongo;
  if (!uri) throw new Error('No Mongo URI configured (MONGO_URI)');

  mongoClient = new mongodb.MongoClient(uri);

  return mongoClient;
}

export async function connect(client: mongodb.MongoClient = createClient()): Promise<void> {
  mongoClient = client;
  await client.connect();
}

export function getDb(): Db {
  if (!mongoClient) throw new Error('No Db connected');

  const db = mongoClient.db();

  return {
    productCategories: db.collection('productCategories'),
  };
}

export async function disconnect(): Promise<void> {
  if (!mongoClient) return;

  await mongoClient.close();
}
