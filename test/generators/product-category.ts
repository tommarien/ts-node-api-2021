import { ObjectId } from 'mongodb';
import { ProductCategory } from '../../src/db/product-category';

export const televisionAndVideo = (): ProductCategory => ({
  _id: new ObjectId('616d650d668541a6dd611e51'),
  slug: 'television_and_video',
  name: 'Television & Video'
});

export const computerMonitors = (): ProductCategory => ({
  _id: new ObjectId('616d6645650c46850d61cb3f'),
  slug: 'monitors',
  name: 'Computer Monitors'
});

export const cellPhoneAndAccessories = (): ProductCategory => ({
  _id: new ObjectId('616d66496b25c95d6c0a64af'),
  slug: 'cell_phones_and_accessories',
  name: 'Cell Phones & Accessories'
});
