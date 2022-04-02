import { Env } from '../config/env';

declare global {
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface ProcessEnv extends Env {}
  }
}

export {};
