import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { DependencyContainer } from 'tsyringe';
import buildContainer from '../../container';

const tsyringePlugin: FastifyPluginAsync = async (instance) => {
  const container = buildContainer(instance);

  instance.decorateRequest('container', null);

  instance.addHook('onRequest', async (req) => {
    req.container = container.createChildContainer();
  });

  instance.addHook('onResponse', async (req) => {
    (req.container as DependencyContainer).clearInstances();
  });
};

export default fp(tsyringePlugin, {
  name: 'fastify-tsyringe',
  dependencies: ['fastify-mongo'],
});
