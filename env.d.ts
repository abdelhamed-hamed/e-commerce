declare namespace NodeJS {
  interface ProcessEnv {
    readonly PORT: number;
    readonly DB: string;
    readonly NODE_ENV: "development" | "production";
    readonly BASE_URL: string;
    JWT_SECRET_KEY: string;
    JWT_EXPIRED: string;
  }
}
