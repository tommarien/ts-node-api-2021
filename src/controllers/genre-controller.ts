import { injectable } from 'tsyringe';
import { DbContext } from '../db/db-context';
import { Genre } from '../db/genre';
import { GenreRequestBody, GenreResponseBody } from '../dtos';

const map = ({ _id, name }: Genre): GenreResponseBody => ({
  id: _id.toHexString(),
  name,
});

@injectable()
export class GenreController {
  constructor(private readonly db: DbContext) {}

  async save(genre: GenreRequestBody): Promise<GenreResponseBody> {
    const { insertedId } = await this.db.genres.insertOne(genre);

    return map({ _id: insertedId, ...genre })
  }
}
