import test from 'ava';
import { MongoClient } from 'mongodb';
import { buildTestServer } from '../../../../../test/server';
import * as db from '../../../../db/mongodb';
import { ProductCategory } from '../../../../db/product-category';

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
  await db.connect(
    new MongoClient('mongodb://localhost/webshop-node-2021-test'),
  );
});

test.afterEach.always(async () => {
  await db.getDb().productCategories.deleteMany({});
});

test.after(db.disconnect);

test.serial('creates a new productCategory', async (t) => {
  const payload = buildValidProductCategoryPayload();

  const res = await postProductCategory(payload);

  t.is(res.statusCode, 200);

  const storedProductCategory = (await db
    .getDb()
    .productCategories.findOne()) as ProductCategory;

  t.not(storedProductCategory, null);

  t.deepEqual(storedProductCategory, {
    _id: storedProductCategory._id,
    slug: payload.slug,
    name: payload.name,
  });

  const body = res.json();
  t.deepEqual(body, {
    id: storedProductCategory._id.toHexString(),
    ...payload,
  });
});
