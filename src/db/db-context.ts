import { Collection, MongoClient } from 'mongodb';
import { Genre } from './genre';
import { ProductCategory } from './product-category';

export class DbContext {
  constructor(private readonly mongoClient: MongoClient) {}

  get productCategories(): Collection<ProductCategory> {
    return this.mongoClient.db().collection('productCategories');
  }

  get genres(): Collection<Genre> {
    return this.mongoClient.db().collection('genres')
  }
}
