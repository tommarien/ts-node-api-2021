import { Conflict } from 'http-errors';
import { MongoServerError } from 'mongodb';
import { DbContext, Genre } from '../../db';
import { GenreRequestBody, GenreResponseBody } from './schemas';

const map = ({ _id, name, slug }: Genre): GenreResponseBody => ({
  id: _id.toHexString(),
  name,
  slug,
});

export default class GenreService {
  constructor(private readonly db: DbContext) {}

  async save(genre: GenreRequestBody): Promise<GenreResponseBody> {
    try {
      const { insertedId } = await this.db.genres.insertOne(genre);
      return map({ _id: insertedId, ...genre });
    } catch (err) {
      if (err instanceof MongoServerError) {
        throw new Conflict(`A genre with slug '${genre.slug}' already exists`);
      }

      throw err;
    }
  }

  async list(): Promise<GenreResponseBody[]> {
    const genres = await this.db.genres.find().sort({ _id: 1 }).toArray();

    return genres.map(map);
  }
}
