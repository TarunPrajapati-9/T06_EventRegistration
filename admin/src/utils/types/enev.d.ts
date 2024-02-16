declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    JWT_SECRET: string;
    NEXT_PUBLIC_COOKIE_TOKEN_KEY: string;
    NEXT_PUBLIC_BACKEND_URI: string;
    UPLOADTHING_SECRET: string;
    UPLOADTHING_APP_ID: string;
    SECRET_HASHING_ALGO: string;
  }
}
