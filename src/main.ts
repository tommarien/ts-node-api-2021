import server from './server.js';
import env from './config/env.js';

// Good practice to stop processing when an unhandledRejection occurs
process.on('unhandledRejection', (err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

await server.listen(env.PORT);

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
