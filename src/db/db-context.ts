import { Collection, MongoClient } from 'mongodb';
import { injectable } from 'tsyringe';
import { ProductCategory } from './product-category';

@injectable()
export class DbContext {
  constructor(private readonly mongoClient: MongoClient) {}

  get productCategories(): Collection<ProductCategory> {
    return this.mongoClient.db().collection('productCategories');
  }
}
