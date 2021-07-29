import fastify from 'fastify';

const server = fastify({ logger: true, disableRequestLogging: true });

server.get('/', async (request, reply) => ({ message: 'Hello world' }));

export default server;
