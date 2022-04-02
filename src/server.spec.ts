import crypto from 'crypto';
import { buildTestServer } from '../test/server';

async function setupServer() {
  const server = buildTestServer();

  server.route({
    method: 'GET',
    url: '/echo-request-id',
    handler: (req, reply) => {
      reply.send({ reqId: req.id });
    },
  });

  return server;
}

describe('Server', () => {
  let server: Awaited<ReturnType<typeof setupServer>>;

  beforeAll(async () => {
    server = await setupServer();
  });

  afterAll(() => server.close());

  it('echoes the value of the x-request-id header', async () => {
    const reqId = 'cf03dfbf-ad44-4d24-b1b3-6a044bdbf570';

    const response = await server.inject({
      method: 'GET',
      url: '/echo-request-id',
      headers: {
        'x-request-id': reqId,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toStrictEqual({ reqId });
  });

  it('creates a new request id using randomUUID', async () => {
    const reqId = 'request-id';

    const randomUUIDStub = jest.spyOn(crypto, 'randomUUID');
    randomUUIDStub.mockReturnValue(reqId);

    const response = await server.inject({
      method: 'GET',
      url: '/echo-request-id',
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toStrictEqual({ reqId });
    expect(randomUUIDStub).toBeCalledTimes(1);
  });
});
