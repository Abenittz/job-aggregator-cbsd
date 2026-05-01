import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Environment Configuration Interface
 */
export interface EnvConfig {
  JWT_SECRET: string;
  MONGODB_URI: string;
  PORT: number;
  NODE_ENV: string;
}

/**
 * Validate environment variables
 * @throws Error if required environment variables are missing or invalid
 */
function validateEnv(): EnvConfig {
  const errors: string[] = [];

  // Validate JWT_SECRET
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    errors.push('JWT_SECRET is required');
  } else if (JWT_SECRET.length < 32) {
    errors.push('JWT_SECRET must be at least 32 characters long');
  }

  // Validate MONGODB_URI
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    errors.push('MONGODB_URI is required');
  }

  // Validate PORT
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
  if (isNaN(PORT) || PORT < 1 || PORT > 65535) {
    errors.push('PORT must be a valid number between 1 and 65535');
  }

  // Get NODE_ENV (defaults to 'development')
  const NODE_ENV = process.env.NODE_ENV || 'development';

  // Throw error if validation failed
  if (errors.length > 0) {
    throw new Error(
      `Environment validation failed:\n${errors.map((e) => `  - ${e}`).join('\n')}`
    );
  }

  return {
    JWT_SECRET: JWT_SECRET!,
    MONGODB_URI: MONGODB_URI!,
    PORT,
    NODE_ENV,
  };
}

/**
 * Validated environment configuration
 * This will throw an error on module load if validation fails
 */
export const env = validateEnv();

/**
 * Check if running in production environment
 */
export const isProduction = env.NODE_ENV === 'production';

/**
 * Check if running in development environment
 */
export const isDevelopment = env.NODE_ENV === 'development';

/**
 * Check if running in test environment
 */
export const isTest = env.NODE_ENV === 'test';
