import { ObjectId } from 'mongodb';

export interface ProductCategory {
  _id: ObjectId;
  name: string;
  slug: string;
}
