import { expect } from 'chai';
import { createGenre } from '../../../test/generators';
import { buildTestServer } from '../../../test/server';
import { GenreRequestBody } from '../../services';

const url = '/api/genres';

const buildValidBody = (): GenreRequestBody => ({
  name: 'Action',
  slug: 'action',
});

describe(`${url} POST`, () => {
  let server: Awaited<ReturnType<typeof buildTestServer>>;

  before(async () => {
    server = await buildTestServer();
  });

  afterEach(async () => {
    await server.mongo.db.genres.deleteMany({});
  });

  after(async () => {
    await server.close();
  });

  async function postGenre(genre: object) {
    return server.inject({
      method: 'post',
      url,
      payload: genre,
    });
  }
  describe('200 (OK)', () => {
    it('creates a new genre', async () => {
      const payload = buildValidBody();

      const res = await postGenre(payload);
      expect(res).to.haveOwnProperty('statusCode', 200);

      const genre = await server.mongo.db.genres.findOne();
      if (!genre) expect.fail('No Genre stored');

      expect(genre).to.include({
        name: payload.name,
      });

      expect(res.json()).to.deep.eq({
        id: genre._id.toHexString(),
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

    describe('name', () => {
      it('returns the status if name is missing', async () => {
        const { name, ...rest } = buildValidBody();
        const res = await postGenre(rest);

        expect(res).to.haveOwnProperty('statusCode', 400);
        expect(res.json()).to.deep.eq(
          badRequest("body should have required property 'name'"),
        );
      });

      it('returns the status if name is longer than 40 chars', async () => {
        const res = await postGenre({
          ...buildValidBody(),
          name: 'b'.repeat(41),
        });

        expect(res).to.haveOwnProperty('statusCode', 400);
        expect(res.json()).to.deep.eq(
          badRequest('body.name should NOT be longer than 40 characters'),
        );
      });
    });

    describe('slug', () => {
      it('returns the status if slug is missing', async () => {
        const { slug, ...rest } = buildValidBody();

        const res = await postGenre(rest);

        expect(res).to.haveOwnProperty('statusCode', 400);
        expect(res.json()).to.deep.eq(
          badRequest("body should have required property 'slug'"),
        );
      });

      it('returns the status if slug is shorter than 2 chars', async () => {
        const res = await postGenre({
          ...buildValidBody(),
          slug: 'a',
        });

        expect(res).to.haveOwnProperty('statusCode', 400);
        expect(res.json()).to.deep.eq(
          badRequest('body.slug should NOT be shorter than 2 characters'),
        );
      });

      it('returns the status if slug is is above 40 chars', async () => {
        const res = await postGenre({
          ...buildValidBody(),
          slug: 'a'.repeat(41),
        });

        expect(res).to.haveOwnProperty('statusCode', 400);
        expect(res.json()).to.deep.eq(
          badRequest('body.slug should NOT be longer than 40 characters'),
        );
      });

      it('returns the status if slug is not a valid slug', async () => {
        const res = await postGenre({
          ...buildValidBody(),
          slug: 'this-is-not-!-valid',
        });

        expect(res).to.haveOwnProperty('statusCode', 400);
        expect(res.json()).to.deep.eq(
          badRequest('body.slug should match format "slug"'),
        );
      });
    });
  });

  describe('409 (Conflict)', () => {
    before(async () => {
      await server.mongo.db.genres.insertOne(createGenre());
    });

    it('returns status if slug is not unique', async () => {
      const res = await postGenre(buildValidBody());

      expect(res).to.haveOwnProperty('statusCode', 409);
      expect(res.json()).to.deep.eq({
        error: 'Conflict',
        message: "A genre with slug 'action' already exists",
        statusCode: 409,
      });
    });
  });
});
