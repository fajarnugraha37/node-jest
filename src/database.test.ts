import { createDatabase, IDatabase } from './database';
import mysql, { ResultSetHeader, RowDataPacket } from 'mysql2/promise';

// Mock the mysql2/promise module
jest.mock('mysql2/promise', () => ({
  createPool: jest.fn(() => ({
    query: jest.fn()
  }))
}));

describe('createDatabase', () => {
  let mockPool: { query: jest.Mock };
  let db: IDatabase;

  // Sample configuration for the database
  const dbConfig = {
    host: 'localhost',
    port: 3306,
    user: 'test_user',
    password: 'test_password',
    database: 'test_db'
  };

  beforeEach(async () => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Set up the mock pool
    mockPool = {
      query: jest.fn()
    };

    // Mock createPool to return the mock pool
    (mysql.createPool as jest.Mock).mockReturnValue(mockPool);

    // Create the database instance
    db = await createDatabase(
      dbConfig.host,
      dbConfig.port,
      dbConfig.user,
      dbConfig.password,
      dbConfig.database
    );
  });

  test('should create a database connection with correct configuration', async () => {
    // Assert
    expect(mysql.createPool).toHaveBeenCalledWith({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database
    });
    expect(db).toHaveProperty('getUser');
    expect(db).toHaveProperty('createUser');
  });

  describe('getUser', () => {
    test('should return user data for a valid username', async () => {
      // Arrange
      const mockUser: RowDataPacket = {
        username: 'testuser',
        password: 'hashedpassword'
      } as any;
      mockPool.query.mockResolvedValue([[mockUser]]);

      // Act
      const result = await db.getUser('testuser');

      // Assert
      expect(mockPool.query).toHaveBeenCalledWith(
        `SELECT * 
        FROM users 
        WHERE username = ?`,
        ['testuser']
      );
      expect(result).toEqual(mockUser);
    });

    test('should handle empty result when user is not found', async () => {
      // Arrange
      mockPool.query.mockResolvedValue([[]]);

      // Act
      const result = await db.getUser('nonexistent');

      // Assert
      expect(mockPool.query).toHaveBeenCalledWith(
        `SELECT * 
        FROM users 
        WHERE username = ?`,
        ['nonexistent']
      );
      expect(result).toBeUndefined();
    });

    test('should throw error when query fails', async () => {
      // Arrange
      const error = new Error('Database query failed');
      mockPool.query.mockRejectedValue(error);

      // Act & Assert
      await expect(db.getUser('testuser')).rejects.toThrow('Database query failed');
      expect(mockPool.query).toHaveBeenCalledWith(
        `SELECT * 
        FROM users 
        WHERE username = ?`,
        ['testuser']
      );
    });
  });

  describe('createUser', () => {
    test('should create a user and return insertId', async () => {
      // Arrange
      const mockResult: ResultSetHeader[] = [{
        insertId: 1,
        affectedRows: 1,
        info: '',
        serverStatus: 2,
        warningStatus: 0
      }] as any;
      mockPool.query.mockResolvedValue([mockResult]);

      // Act
      const insertId = await db.createUser('newuser', 'password123');

      // Assert
      expect(mockPool.query).toHaveBeenCalledWith(
        `INSERT INTO users (username, password) 
        VALUES (?, ?)`,
        ['newuser', 'password123']
      );
      expect(insertId).toBe(1);
    });

    test('should throw error when insert query fails', async () => {
      // Arrange
      const error = new Error('Insert query failed');
      mockPool.query.mockRejectedValue(error);

      // Act & Assert
      await expect(db.createUser('newuser', 'password123')).rejects.toThrow('Insert query failed');
      expect(mockPool.query).toHaveBeenCalledWith(
        `INSERT INTO users (username, password) 
        VALUES (?, ?)`,
        ['newuser', 'password123']
      );
    });
  });
});