import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import buildContainer from '../../container';

const inversifyPlugin: FastifyPluginCallback = async (
  instance,
  _opts,
  done,
) => {
  const container = buildContainer(instance.mongo);
  instance.decorate('container', container);
  done();
};

export default fp(inversifyPlugin, {
  name: 'fastify-inversify',
  dependencies: ['fastify-mongo'],
});
