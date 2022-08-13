import createServer from './server';
import getConfig from './config/config';

// Good practice to stop processing when an unhandledRejection occurs
process.on('unhandledRejection', (err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

async function main() {
  const config = getConfig();

  const server = createServer(config);

  await server.listen({ port: config.server.port });

  const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM'];
  for (const signal of signals) {
    // Use once() so that double signals exits the app
    process.once(signal, () => {
      server.log.info({ signal }, 'closing application');

      server.close().then(
        () => {
          server.log.info({ signal }, 'application closed');
          process.exit(0);
        },
        (err) => {
          server.log.error({ err }, 'Error closing the application');
          process.exit(1);
        },
      );
    });
  }
}

// eslint-disable-next-line no-console
main().catch(console.error);
