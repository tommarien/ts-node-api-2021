import { injectable } from 'tsyringe';
import { DbContext } from '../db/db-context';
import { Genre } from '../db/genre';

export interface GenreRequestBody {
  name: string;
}

export interface GenreResponseBody extends GenreRequestBody {
  id: string;
}

const map = ({ _id, name }: Genre): GenreResponseBody => ({
  id: _id.toHexString(),
  name,
});

@injectable()
export class GenreService {
  constructor(private readonly db: DbContext) {}

  async save(genre: GenreRequestBody): Promise<GenreResponseBody> {
    const { insertedId } = await this.db.genres.insertOne(genre);

    return map({ _id: insertedId, ...genre });
  }

  async list(): Promise<GenreResponseBody[]> {
    const genres = await this.db.genres.find().sort({ _id: 1 }).toArray();

    return genres.map(map);
  }
}
