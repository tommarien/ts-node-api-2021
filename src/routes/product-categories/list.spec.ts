import { expect } from 'chai';
import { productCategories } from '../../../test/generators';
import { buildTestServer } from '../../../test/server';

const url = '/api/product-categories';

describe(`${url} GET`, () => {
  let server: Awaited<ReturnType<typeof buildTestServer>>;

  before(async () => {
    server = await buildTestServer();

    await server.mongo.db.productCategories.insertMany([
      productCategories.televisionAndVideo(),
      productCategories.computerMonitors(),
      productCategories.cellPhoneAndAccessories(),
    ]);
  });

  it('returns the categories', async () => {
    const response = await server.inject({
      method: 'GET',
      url,
    });

    expect(response.statusCode).to.eq(200);
    expect(response.json()).to.deep.equal(
      [
        productCategories.cellPhoneAndAccessories(),
        productCategories.computerMonitors(),
        productCategories.televisionAndVideo(),
      ].map((x) => ({ id: x._id.toHexString(), slug: x.slug, name: x.name })),
    );
  });

  after(async () => {
    await server.mongo.db.productCategories.deleteMany({});
    await server.close();
  });
});
