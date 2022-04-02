declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      MONGO_URI: string;
    }
  }
}

export {};
