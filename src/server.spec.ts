import tap from 'tap';
import crypto from 'crypto';
import * as td from 'testdouble';

async function setupServer() {
  const createServer = await import('./server.js');

  const server = createServer.default();

  server.route({
    method: 'GET',
    url: '/echo-request-id',
    handler: (req, reply) => {
      reply.send({ reqId: req.id });
    },
  });

  return server;
}

tap.afterEach(() => td.reset());

tap.test('it echoes the value of the x-request-id header', async (t) => {
  t.plan(2);

  const server = await setupServer();

  const reqId = 'cf03dfbf-ad44-4d24-b1b3-6a044bdbf570';

  const response = await server.inject({
    method: 'GET',
    url: '/echo-request-id',
    headers: {
      'x-request-id': reqId,
    },
  });

  t.equal(response.statusCode, 200);
  t.same(response.json(), { reqId });
});

tap.test('it creates a new request id using randomUUID', async (t) => {
  td.replace(crypto, 'randomUUID');

  const reqId = 'request-id';
  td.when(crypto.randomUUID()).thenReturn(reqId);

  const server = await setupServer();

  const response = await server.inject({
    method: 'GET',
    url: '/echo-request-id',
  });

  t.equal(response.statusCode, 200);
  t.same(response.json(), { reqId });
});
