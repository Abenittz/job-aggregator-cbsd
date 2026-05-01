/**
 * Environment Configuration Tests
 * 
 * Note: These tests validate the environment configuration logic.
 * The actual env module cannot be easily tested due to its immediate execution,
 * so we test the validation logic in isolation.
 */

describe('Environment Configuration', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...ORIGINAL_ENV };
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  describe('JWT_SECRET validation', () => {
    it('should require JWT_SECRET to be set', () => {
      delete process.env.JWT_SECRET;
      process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
      process.env.PORT = '5000';

      expect(() => {
        jest.isolateModules(() => {
          require('./env');
        });
      }).toThrow('JWT_SECRET is required');
    });

    it('should require JWT_SECRET to be at least 32 characters', () => {
      process.env.JWT_SECRET = 'short-secret';
      process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
      process.env.PORT = '5000';

      expect(() => {
        jest.isolateModules(() => {
          require('./env');
        });
      }).toThrow('JWT_SECRET must be at least 32 characters long');
    });

    it('should accept JWT_SECRET with 32 or more characters', () => {
      process.env.JWT_SECRET = 'this-is-a-valid-secret-key-with-32-plus-characters';
      process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
      process.env.PORT = '5000';

      expect(() => {
        jest.isolateModules(() => {
          const { env } = require('./env');
          expect(env.JWT_SECRET).toBe('this-is-a-valid-secret-key-with-32-plus-characters');
        });
      }).not.toThrow();
    });
  });

  describe('MONGODB_URI validation', () => {
    it('should require MONGODB_URI to be set', () => {
      process.env.JWT_SECRET = 'valid-secret-key-that-is-at-least-32-characters-long';
      delete process.env.MONGODB_URI;
      process.env.PORT = '5000';

      expect(() => {
        jest.isolateModules(() => {
          require('./env');
        });
      }).toThrow('MONGODB_URI is required');
    });

    it('should accept valid MONGODB_URI', () => {
      process.env.JWT_SECRET = 'valid-secret-key-that-is-at-least-32-characters-long';
      process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
      process.env.PORT = '5000';

      expect(() => {
        jest.isolateModules(() => {
          const { env } = require('./env');
          expect(env.MONGODB_URI).toBe('mongodb://localhost:27017/test');
        });
      }).not.toThrow();
    });
  });

  describe('PORT validation', () => {
    it('should default to 5000 if PORT is not set', () => {
      process.env.JWT_SECRET = 'valid-secret-key-that-is-at-least-32-characters-long';
      process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
      delete process.env.PORT;

      jest.isolateModules(() => {
        const { env } = require('./env');
        expect(env.PORT).toBe(5000);
      });
    });

    it('should accept valid PORT number', () => {
      process.env.JWT_SECRET = 'valid-secret-key-that-is-at-least-32-characters-long';
      process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
      process.env.PORT = '3000';

      jest.isolateModules(() => {
        const { env } = require('./env');
        expect(env.PORT).toBe(3000);
      });
    });

    it('should reject invalid PORT number', () => {
      process.env.JWT_SECRET = 'valid-secret-key-that-is-at-least-32-characters-long';
      process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
      process.env.PORT = 'invalid';

      expect(() => {
        jest.isolateModules(() => {
          require('./env');
        });
      }).toThrow('PORT must be a valid number between 1 and 65535');
    });

    it('should reject PORT number out of range', () => {
      process.env.JWT_SECRET = 'valid-secret-key-that-is-at-least-32-characters-long';
      process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
      process.env.PORT = '70000';

      expect(() => {
        jest.isolateModules(() => {
          require('./env');
        });
      }).toThrow('PORT must be a valid number between 1 and 65535');
    });
  });

  describe('NODE_ENV', () => {
    it('should default to development if NODE_ENV is not set', () => {
      process.env.JWT_SECRET = 'valid-secret-key-that-is-at-least-32-characters-long';
      process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
      process.env.PORT = '5000';
      delete process.env.NODE_ENV;

      jest.isolateModules(() => {
        const { env } = require('./env');
        expect(env.NODE_ENV).toBe('development');
      });
    });

    it('should accept custom NODE_ENV value', () => {
      process.env.JWT_SECRET = 'valid-secret-key-that-is-at-least-32-characters-long';
      process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
      process.env.PORT = '5000';
      process.env.NODE_ENV = 'production';

      jest.isolateModules(() => {
        const { env } = require('./env');
        expect(env.NODE_ENV).toBe('production');
      });
    });
  });

  describe('Environment helpers', () => {
    it('should correctly identify production environment', () => {
      process.env.JWT_SECRET = 'valid-secret-key-that-is-at-least-32-characters-long';
      process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
      process.env.PORT = '5000';
      process.env.NODE_ENV = 'production';

      jest.isolateModules(() => {
        const { isProduction, isDevelopment, isTest } = require('./env');
        expect(isProduction).toBe(true);
        expect(isDevelopment).toBe(false);
        expect(isTest).toBe(false);
      });
    });

    it('should correctly identify development environment', () => {
      process.env.JWT_SECRET = 'valid-secret-key-that-is-at-least-32-characters-long';
      process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
      process.env.PORT = '5000';
      process.env.NODE_ENV = 'development';

      jest.isolateModules(() => {
        const { isProduction, isDevelopment, isTest } = require('./env');
        expect(isProduction).toBe(false);
        expect(isDevelopment).toBe(true);
        expect(isTest).toBe(false);
      });
    });

    it('should correctly identify test environment', () => {
      process.env.JWT_SECRET = 'valid-secret-key-that-is-at-least-32-characters-long';
      process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
      process.env.PORT = '5000';
      process.env.NODE_ENV = 'test';

      jest.isolateModules(() => {
        const { isProduction, isDevelopment, isTest } = require('./env');
        expect(isProduction).toBe(false);
        expect(isDevelopment).toBe(false);
        expect(isTest).toBe(true);
      });
    });
  });

  describe('Multiple validation errors', () => {
    it('should report all validation errors at once', () => {
      delete process.env.JWT_SECRET;
      delete process.env.MONGODB_URI;
      process.env.PORT = 'invalid';

      expect(() => {
        jest.isolateModules(() => {
          require('./env');
        });
      }).toThrow(/JWT_SECRET is required.*MONGODB_URI is required.*PORT must be a valid number/s);
    });
  });
});
