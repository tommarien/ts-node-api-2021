import tap from 'tap';
import sinon from 'sinon';
import createServer from './server';

tap.afterEach(() => sinon.restore);

async function setupServer() {
  const server = createServer({
    isProduction: false,
    server: { port: '3000' },
    mongo: { uri: 'mongodb://unused' },
    logger: { level: 'info' },
  });

  server.route({
    method: 'GET',
    url: '/echo-request-id',
    handler: (req, reply) => {
      reply.send({ reqId: req.id });
    },
  });

  return server;
}

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
