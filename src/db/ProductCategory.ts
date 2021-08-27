import { ObjectId } from 'mongodb';

export interface ProductCategory {
  _id: ObjectId;
  slug: string;
  name: string;
}
