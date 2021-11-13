import avaTest, { TestInterface } from 'ava';
import sinon, { SinonSandbox } from 'sinon';
import crypto from 'crypto';
import { FastifyInstance } from 'fastify';
import { buildTestServer } from '../test/server';

const test = avaTest as TestInterface<{
  sandbox: SinonSandbox;
  server: FastifyInstance;
}>;

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

test.before(async (t) => {
  t.context.server = await setupServer();
});

test.beforeEach(async (t) => {
  t.context.sandbox = sinon.createSandbox();
});

test.afterEach.always((t) => {
  t.context.sandbox.restore();
});

test.after.always(async (t) => {
  await t.context.server.close();
});

test('it echoes the value of the x-request-id header', async (t) => {
  const reqId = 'cf03dfbf-ad44-4d24-b1b3-6a044bdbf570';

  const response = await t.context.server.inject({
    method: 'GET',
    url: '/echo-request-id',
    headers: {
      'x-request-id': reqId,
    },
  });

  t.is(response.statusCode, 200);
  t.like(response.json(), { reqId });
});

test('it creates a new request id using randomUUID', async (t) => {
  const reqId = 'request-id';

  const randomUUIDStub = t.context.sandbox
    .stub(crypto, 'randomUUID')
    .returns(reqId);

  const response = await t.context.server.inject({
    method: 'GET',
    url: '/echo-request-id',
  });

  t.is(response.statusCode, 200);
  t.like(response.json(), { reqId });
  t.true(randomUUIDStub.called);
});
