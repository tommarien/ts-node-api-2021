import { FastifyMongo } from '../plugins/mongodb';
import { DependencyScope } from './api';

declare module 'fastify' {
  interface FastifyInstance {
    mongo: FastifyMongo;
  }

  interface FastifyRequest {
    container: DependencyScope;
  }
}
