// Load environment variables - dotenv is already loaded in app.ts

// Interface for environment variables
interface EnvVars {
  PORT: number;
  NODE_ENV: string;
  MONGODB_URI: string;
  MONGO_URI: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  JWT_COOKIE_EXPIRES: number;
  CORS_ORIGIN: string;
  FRONTEND_URL: string;
  API_PREFIX: string;
  BCRYPT_SALT_ROUNDS: number;
  RATE_LIMIT_WINDOW_MS: number;
  RATE_LIMIT_MAX_REQUESTS: number;
  LOG_LEVEL: string;
  DB_MAX_POOL_SIZE: number;
  DB_MIN_POOL_SIZE: number;
}

// Validate and export environment variables
export const env: EnvVars = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/safespace',
  MONGO_URI: process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/safespace',
  JWT_SECRET: process.env.JWT_SECRET || 'fallback_secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '30d',
  JWT_COOKIE_EXPIRES: parseInt(process.env.JWT_COOKIE_EXPIRES || '30', 10),
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  API_PREFIX: process.env.API_PREFIX || '/api/v1',
  BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10),
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  DB_MAX_POOL_SIZE: parseInt(process.env.DB_MAX_POOL_SIZE || '10', 10),
  DB_MIN_POOL_SIZE: parseInt(process.env.DB_MIN_POOL_SIZE || '5', 10),
};

// Validate required environment variables
const requiredEnvVars = ['JWT_SECRET'];

const validateEnv = (): void => {
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar] || process.env[envVar] === 'fallback_secret') {
      if (env.NODE_ENV === 'production') {
        throw new Error(`Missing required environment variable: ${envVar}`);
      } else if (envVar === 'JWT_SECRET') {
        console.warn(`⚠️  Using fallback ${envVar} in development mode`);
      }
    }
  }
};

// Run validation
validateEnv();

export default env;
