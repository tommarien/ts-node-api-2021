import { expect } from 'chai';
import { buildTestServer } from '../../../test/server';
import { GenreRequestBody } from '../../dtos';

const url = '/api/genres';

const buildGenre = (): GenreRequestBody => ({ name: 'Action' });

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
      const payload = buildGenre();

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
        const res = await postGenre({});

        expect(res).to.haveOwnProperty('statusCode', 400);
        expect(res.json()).to.deep.eq(
          badRequest("body should have required property 'name'"),
        );
      });

      it('returns the status if name is longer than 40 chars', async () => {
        const res = await postGenre({
          name: 'b'.repeat(41),
        });

        expect(res).to.haveOwnProperty('statusCode', 400);
        expect(res.json()).to.deep.eq(
          badRequest('body.name should NOT be longer than 40 characters'),
        );
      });
    });
  });
});
