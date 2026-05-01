import { generateToken, verifyToken, decodeToken } from './jwt';

// Mock environment variable
const ORIGINAL_ENV = process.env;

beforeEach(() => {
  jest.resetModules();
  process.env = { ...ORIGINAL_ENV };
  process.env.JWT_SECRET = 'test-secret-key-that-is-at-least-32-characters-long';
});

afterAll(() => {
  process.env = ORIGINAL_ENV;
});

describe('JWT Utilities', () => {
  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const userId = '507f1f77bcf86cd799439011';
      const email = 'test@example.com';

      const token = generateToken(userId, email);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    it('should throw error if JWT_SECRET is not configured', () => {
      delete process.env.JWT_SECRET;

      expect(() => {
        generateToken('userId', 'test@example.com');
      }).toThrow('JWT_SECRET is not configured');
    });

    it('should generate different tokens for different users', () => {
      const token1 = generateToken('user1', 'user1@example.com');
      const token2 = generateToken('user2', 'user2@example.com');

      expect(token1).not.toBe(token2);
    });
  });

  describe('verifyToken', () => {
    it('should verify and decode a valid token', () => {
      const userId = '507f1f77bcf86cd799439011';
      const email = 'test@example.com';

      const token = generateToken(userId, email);
      const decoded = verifyToken(token);

      expect(decoded.userId).toBe(userId);
      expect(decoded.email).toBe(email);
    });

    it('should throw error for invalid token', () => {
      const invalidToken = 'invalid.token.here';

      expect(() => {
        verifyToken(invalidToken);
      }).toThrow('Invalid token');
    });

    it('should throw error if JWT_SECRET is not configured', () => {
      delete process.env.JWT_SECRET;

      expect(() => {
        verifyToken('some.token.here');
      }).toThrow('JWT_SECRET is not configured');
    });

    it('should throw error for token with wrong signature', () => {
      const token = generateToken('userId', 'test@example.com');
      
      // Change the secret to simulate wrong signature
      process.env.JWT_SECRET = 'different-secret-key-that-is-at-least-32-chars';

      expect(() => {
        verifyToken(token);
      }).toThrow('Invalid token');
    });
  });

  describe('decodeToken', () => {
    it('should decode a token without verification', () => {
      const userId = '507f1f77bcf86cd799439011';
      const email = 'test@example.com';

      const token = generateToken(userId, email);
      const decoded = decodeToken(token);

      expect(decoded).not.toBeNull();
      expect(decoded?.userId).toBe(userId);
      expect(decoded?.email).toBe(email);
    });

    it('should return null for invalid token', () => {
      const invalidToken = 'not-a-valid-token';

      const decoded = decodeToken(invalidToken);

      expect(decoded).toBeNull();
    });
  });

  describe('Token expiration', () => {
    it('should include expiration in token payload', () => {
      const token = generateToken('userId', 'test@example.com');
      const decoded = decodeToken(token);

      expect(decoded).toHaveProperty('exp');
      expect(decoded).toHaveProperty('iat');
    });

    it('should set expiration to 7 days from now', () => {
      const token = generateToken('userId', 'test@example.com');
      const decoded = decodeToken(token);

      const now = Math.floor(Date.now() / 1000);
      const sevenDays = 7 * 24 * 60 * 60; // 7 days in seconds

      // Allow 5 second tolerance for test execution time
      expect(decoded?.exp).toBeGreaterThan(now + sevenDays - 5);
      expect(decoded?.exp).toBeLessThan(now + sevenDays + 5);
    });
  });
});
