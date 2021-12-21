import { ObjectId } from 'mongodb';

export interface Genre {
  _id: ObjectId;
  slug: string;
  name: string;
}
