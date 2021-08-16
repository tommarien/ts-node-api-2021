import fastify from 'fastify';
import createServer from '../src/server';

export const buildTestServer = (): ReturnType<typeof fastify> => {
  const server = createServer({
    isProduction: false,
    server: { port: '3000' },
    mongo: { uri: 'mongodb://localhost/webshop-node-2021-test' },
    logger: { level: 'fatal' },
  });

  return server;
};
