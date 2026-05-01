import jwt from 'jsonwebtoken';

/**
 * JWT Token Payload Interface
 */
export interface TokenPayload {
  userId: string;
  email: string;
  iat?: number;  // Issued at timestamp (added by JWT library)
  exp?: number;  // Expiration timestamp (added by JWT library)
}

/**
 * JWT Configuration
 */
const JWT_EXPIRATION = '7d'; // 7 days
const JWT_ALGORITHM = 'HS256' as const;

/**
 * Get JWT secret from environment
 * @returns JWT secret
 */
function getJWTSecret(): string {
  return process.env.JWT_SECRET || '';
}

/**
 * Generate a JWT token for a user
 * @param userId - The user's MongoDB ObjectId as a string
 * @param email - The user's email address
 * @returns Signed JWT token
 * @throws Error if JWT_SECRET is not configured
 */
export function generateToken(userId: string, email: string): string {
  const JWT_SECRET = getJWTSecret();
  
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }

  const payload: TokenPayload = {
    userId,
    email,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRATION,
    algorithm: JWT_ALGORITHM,
  });
}

/**
 * Verify and decode a JWT token
 * @param token - The JWT token to verify
 * @returns Decoded token payload
 * @throws Error if token is invalid, expired, or JWT_SECRET is not configured
 */
export function verifyToken(token: string): TokenPayload {
  const JWT_SECRET = getJWTSecret();
  
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: [JWT_ALGORITHM],
    }) as TokenPayload;

    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token has expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token');
    }
    throw error;
  }
}

/**
 * Decode a JWT token without verification (for debugging purposes only)
 * @param token - The JWT token to decode
 * @returns Decoded token payload or null if invalid
 */
export function decodeToken(token: string): TokenPayload | null {
  try {
    return jwt.decode(token) as TokenPayload;
  } catch {
    return null;
  }
}
