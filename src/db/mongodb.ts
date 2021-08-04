import { Collection, ObjectId, MongoClient } from 'mongodb';

let mongoClient: MongoClient | undefined;

export interface Db {
  productCategories: Collection<ProductCategory>;
}

export interface ProductCategory {
  _id: ObjectId;
  name: string;
  slug: string;
}

export async function connect(client: MongoClient): Promise<void> {
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
