import { ObjectId } from 'mongodb';

export interface Genre {
  _id: ObjectId;
  name: string;
}
