/* eslint-disable import/no-extraneous-dependencies */
import * as tsNodeLoader from 'ts-node/esm';
import * as tdLoader from 'testdouble';

export default {
  loaders: [tdLoader, tsNodeLoader],
};
