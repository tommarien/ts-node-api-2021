import { Collection, MongoClient } from 'mongodb';
import { Genre } from './genre';

export class DbContext {
  constructor(private readonly mongoClient: MongoClient) {}

  get genres(): Collection<Genre> {
    return this.mongoClient.db().collection('genres')
  }
}
