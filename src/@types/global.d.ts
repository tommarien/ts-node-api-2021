import { Env } from '../config/config';

declare global {
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface ProcessEnv extends Env {}
  }
}

export {};
