import test from 'ava';
import { MongoClient } from 'mongodb';
import { buildTestServer } from '../../../../../test/server';
import { connect, disconnect, getDb } from '../../../../db/mongodb';

export const buildValidProductCategoryPayload = () => ({
  slug: 'television-and-video',
  name: 'Television & Video',
});

export async function postProductCategory(category: object) {
  const server = buildTestServer();

  return server.inject({
    method: 'post',
    url: '/api/product-categories',
    payload: category,
  });
}

test.before(async () => {
  await connect(new MongoClient(process.env.MONGO_URI));
});

test.after.always(async () => {
  await getDb().productCategories.deleteMany({});
  await disconnect();
});

test.serial('slug is not unique', async (t) => {
  await getDb().productCategories.insertOne(buildValidProductCategoryPayload());

  const res = await postProductCategory(buildValidProductCategoryPayload());

  t.is(res.statusCode, 409);
  t.deepEqual(res.json(), {
    statusCode: 409,
    error: 'Conflict',
    message: `A productCategory with slug 'television-and-video' already exists`,
  });
});
