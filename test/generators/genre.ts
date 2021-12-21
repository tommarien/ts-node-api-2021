import { ObjectId } from 'mongodb';
import { Genre } from '../../src/db/genre';

export function createGenre({
  _id = new ObjectId(),
  slug = 'action',
  name = 'Action',
}: Partial<Genre> = {}): Genre {
  return {
    _id,
    slug,
    name,
  };
}
