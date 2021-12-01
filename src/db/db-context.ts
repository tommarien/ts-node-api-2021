import { Collection, MongoClient } from 'mongodb';
import { ProductCategory } from './product-category';

export class DbContext {
  constructor(private readonly mongoClient: MongoClient) {}

  get productCategories(): Collection<ProductCategory> {
    return this.mongoClient.db().collection('productCategories');
  }
}
