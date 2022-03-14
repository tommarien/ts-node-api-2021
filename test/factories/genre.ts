import { ObjectId } from 'mongodb';
import { Genre } from '../../src/db/genre';
import { ObjectFactory } from './factories';

export const buildGenre: ObjectFactory<Genre> = ({
  _id = new ObjectId(),
  slug = 'action',
  name = 'Action',
} = {}) => ({ _id, slug, name });
