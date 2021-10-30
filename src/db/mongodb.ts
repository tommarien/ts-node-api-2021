import { Collection, MongoClient } from 'mongodb';
import { ProductCategory } from './product-category';

let mongoClient: MongoClient | undefined;

export interface Db {
  productCategories: Collection<ProductCategory>;
}

export async function connect(client: MongoClient): Promise<void> {
  if (mongoClient) return;
  mongoClient = client;
  await client.connect();
}

export function getDb(): Readonly<Db> {
  if (!mongoClient) throw new Error('No Db connected');

  const db = mongoClient.db();

  return {
    productCategories: db.collection('productCategories'),
  };
}

export async function disconnect(): Promise<void> {
  if (!mongoClient) return;
  await mongoClient.close();
  mongoClient = undefined;
}
