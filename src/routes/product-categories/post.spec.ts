import { expect } from 'chai';
import { before } from 'mocha';
import { buildTestServer } from '../../../test/server';

const url = '/api/product-categories';

const buildValidProductCategoryPayload = () => ({
  slug: 'television-and-video',
  name: 'Television & Video',
});

describe(`${url} POST`, () => {
  let server: Awaited<ReturnType<typeof buildTestServer>>;

  before(async () => {
    server = await buildTestServer();
  });

  afterEach(async () => {
    await server.mongo.db.productCategories.deleteMany({});
  });

  after(async () => {
    await server.close();
  });

  async function postProductCategory(category: object) {
    return server.inject({
      method: 'post',
      url,
      payload: category,
    });
  }

  describe('200 (OK)', () => {
    it('creates a new productCategory', async () => {
      const payload = buildValidProductCategoryPayload();

      const res = await postProductCategory(payload);

      expect(res).to.haveOwnProperty('statusCode', 200);

      const storedProductCategory =
        await server.mongo.db.productCategories.findOne();
      if (!storedProductCategory) throw new Error('No ProductCategory stored');

      expect(storedProductCategory).to.deep.eq({
        _id: storedProductCategory._id,
        slug: payload.slug,
        name: payload.name,
      });

      expect(res.json()).to.deep.eq({
        id: storedProductCategory._id.toHexString(),
        ...payload,
      });
    });
  });

  describe('400 (Bad Request)', () => {
    const badRequest = (message: string) => ({
      statusCode: 400,
      error: 'Bad Request',
      message,
    });

    describe('slug', () => {
      it('returns the status if slug is missing', async () => {
        const { slug, ...rest } = buildValidProductCategoryPayload();

        const res = await postProductCategory(rest);

        expect(res).to.haveOwnProperty('statusCode', 400);
        expect(res.json()).to.deep.eq(
          badRequest("body should have required property 'slug'"),
        );
      });

      it('returns the status if slug is shorter than 2 chars', async () => {
        const res = await postProductCategory({
          ...buildValidProductCategoryPayload(),
          slug: 'a',
        });

        expect(res).to.haveOwnProperty('statusCode', 400);
        expect(res.json()).to.deep.eq(
          badRequest('body.slug should NOT be shorter than 2 characters'),
        );
      });

      it('returns the status if slug is is above 40 chars', async () => {
        const res = await postProductCategory({
          ...buildValidProductCategoryPayload(),
          slug: 'a'.repeat(41),
        });

        expect(res).to.haveOwnProperty('statusCode', 400);
        expect(res.json()).to.deep.eq(
          badRequest('body.slug should NOT be longer than 40 characters'),
        );
      });

      it('returns the status if slug is not a valid slug', async () => {
        const res = await postProductCategory({
          ...buildValidProductCategoryPayload(),
          slug: 'this-is-not-!-valid',
        });

        expect(res).to.haveOwnProperty('statusCode', 400);
        expect(res.json()).to.deep.eq(
          badRequest('body.slug should match format "slug"'),
        );
      });
    });

    describe('name', () => {
      it('returns the status if name is missing', async () => {
        const { name, ...rest } = buildValidProductCategoryPayload();

        const res = await postProductCategory(rest);

        expect(res).to.haveOwnProperty('statusCode', 400);
        expect(res.json()).to.deep.eq(
          badRequest("body should have required property 'name'"),
        );
      });

      it('returns the status if name is longer than 60 chars', async () => {
        const res = await postProductCategory({
          ...buildValidProductCategoryPayload(),
          name: 'b'.repeat(61),
        });

        expect(res).to.haveOwnProperty('statusCode', 400);
        expect(res.json()).to.deep.eq(
          badRequest('body.name should NOT be longer than 60 characters'),
        );
      });
    });
  });

  describe('409 (Conflict)', () => {
    before(async () => {
      await server.mongo.db.productCategories.insertOne(
        buildValidProductCategoryPayload(),
      );
    });

    it('returns status if slug is not unique', async () => {
      const res = await postProductCategory(buildValidProductCategoryPayload());

      expect(res).to.haveOwnProperty('statusCode', 409);
      expect(res.json()).to.deep.eq({
        error: 'Conflict',
        message:
          "A productCategory with slug 'television-and-video' already exists",
        statusCode: 409,
      });
    });
  });
});
