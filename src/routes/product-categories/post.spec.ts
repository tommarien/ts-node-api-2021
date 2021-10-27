import test from 'ava';
import { MongoClient } from 'mongodb';
import * as db from '../../db/mongodb';
import { buildTestServer } from '../../../test/server';
import { ProductCategory } from '../../db/product-category';

const buildValidProductCategoryPayload = () => ({
  slug: 'television_and_video',
  name: 'Television & Video',
});

async function postProductCategory(category: Record<string, unknown>) {
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

test.serial(
  'creates a new productCategory if payload is valid',
  async (t) => {
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
  },
);

test.serial('returns conflict (409) if slug is not unique', async (t) => {
  await db
    .getDb()
    .productCategories.insertOne(buildValidProductCategoryPayload());

  const res = await postProductCategory(buildValidProductCategoryPayload());

  t.is(res.statusCode, 409);

  t.deepEqual(res.json(), {
    statusCode: 409,
    error: 'Conflict',
    message: `A productCategory with slug 'television_and_video' already exists`,
  });
});
