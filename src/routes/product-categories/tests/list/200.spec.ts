import { MongoClient } from 'mongodb';
import test from 'ava';
import * as db from '../../../../db/mongodb';
import { buildTestServer } from '../../../../../test/server';
import { productCategories } from '../../../../../test/generators';

test.before(async () => {
  await db.connect(
    new MongoClient('mongodb://localhost/webshop-node-2021-test'),
  );

  await db
    .getDb()
    .productCategories.insertMany([
      productCategories.televisionAndVideo(),
      productCategories.computerMonitors(),
      productCategories.cellPhoneAndAccessories(),
    ]);
});

test.after.always(async () => {
  await db.getDb().productCategories.deleteMany({});
  await db.disconnect();
});

test.serial('returns the categories', async (t) => {
  const server = buildTestServer();

  const response = await server.inject({
    method: 'GET',
    url: '/api/product-categories',
  });

  t.is(response.statusCode, 200);
  t.deepEqual(
    response.json(),
    [
      productCategories.cellPhoneAndAccessories(),
      productCategories.computerMonitors(),
      productCategories.televisionAndVideo(),
    ].map((x) => ({ id: x._id.toHexString(), slug: x.slug, name: x.name })),
  );
});
