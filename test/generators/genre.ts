import { ObjectId } from 'mongodb';
import { Genre } from '../../src/db/genre';

export function buildGenre({
  _id = new ObjectId(),
  name = 'Action',
}: Partial<Genre> = {}): Genre {
  return {
    _id,
    name,
  };
}
