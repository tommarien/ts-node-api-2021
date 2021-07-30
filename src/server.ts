import fastify from 'fastify';
import config from './config.js';

const server = fastify({
  trustProxy: true,
  disableRequestLogging: true,
  logger: { level: config.logger.level },
});

export default server;
