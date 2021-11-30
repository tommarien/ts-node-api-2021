import { interfaces } from 'inversify';
import { FastifyMongo } from '../plugins/mongodb';

declare module 'fastify' {
  interface FastifyInstance {
    mongo: FastifyMongo;
    container: interfaces.Container;
  }
}
