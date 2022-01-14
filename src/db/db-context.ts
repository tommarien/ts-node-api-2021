import { Collection, MongoClient, OptionalId } from 'mongodb';
import { Genre } from './genre';

export class DbContext {
  constructor(private readonly mongoClient: MongoClient) {}

  get genres(): Collection<OptionalId<Genre>> {
    return this.mongoClient.db().collection('genres');
  }
}
