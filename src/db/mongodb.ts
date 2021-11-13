import { Collection, MongoClient } from 'mongodb';
import { ProductCategory } from './product-category';

let mongoClient: MongoClient | undefined;

export interface Db {
  productCategories: Collection<ProductCategory>;
}

export function getCurrentClient(): MongoClient {
  if (!mongoClient) throw new Error('No Db connected');
  return mongoClient;
}

export function registerClient(client: MongoClient) {
  mongoClient = client;
}

export function getDb(client: MongoClient): Readonly<Db> {
  const db = client.db();

  return {
    productCategories: db.collection('productCategories'),
  };
}
