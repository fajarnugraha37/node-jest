import { UserService } from "./user-service";
import { Database } from "./db";
import { userUtils } from "./utils";

// Mock the entire db module
jest.mock("./db", () => {
  return {
    __esModule: true,
    Database: jest.fn().mockImplementation(() => ({
      getUser: jest.fn(),
      saveUser: jest.fn(),
    })),
  };
});
jest.mock("./utils", () => {
  const userUtils = {
    formatName: jest.fn(),
  };
  return { 
    __esModule: true,
    userUtils,
 };
});

describe("UserService", () => {
  let userService: UserService;
  let mockDb: jest.Mocked<Database>;
  let mockUtils: jest.Mocked<typeof userUtils>;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Create a mocked Database instance
    mockDb = new Database() as jest.Mocked<Database>;

    // Create a mocked userUtils object
    mockUtils = userUtils as jest.Mocked<typeof userUtils>;

    // Initialize UserService with mocked dependencies
    userService = new UserService(mockDb, mockUtils);
  });

  // Test with module mocking
  describe("getFormattedUser", () => {
    test("should fetch and format user data", async () => {
      // Arrange: Set up mock behavior
      const mockUser = { id: "123", name: "Test User" };
      mockDb.getUser.mockResolvedValue(mockUser);
      mockUtils.formatName.mockReturnValue("TEST USER");

      // Act
      const result = await userService.getFormattedUser("123");

      // Assert
      expect(mockDb.getUser).toHaveBeenCalledWith("123");
      expect(mockUtils.formatName).toHaveBeenCalledWith("Test User");
      expect(result).toEqual({ id: "123", name: "TEST USER" });
    });

    test("should handle database errors", async () => {
      // Arrange: Simulate database error
      mockDb.getUser.mockRejectedValue(new Error("Database error"));

      // Act & Assert
      await expect(userService.getFormattedUser("123")).rejects.toThrow(
        "Database error"
      );
    });
  });

  // Test with object mocking
  describe("createUser", () => {
    test("should format and save user", async () => {
      // Arrange
      mockUtils.formatName.mockReturnValue("FORMATTED NAME");
      mockDb.saveUser.mockResolvedValue();

      // Act
      await userService.createUser("456", "John Doe");

      // Assert
      expect(mockUtils.formatName).toHaveBeenCalledWith("John Doe");
      expect(mockDb.saveUser).toHaveBeenCalledWith({
        id: "456",
        name: "FORMATTED NAME",
      });
    });

    test("should handle save errors", async () => {
      // Arrange
      mockUtils.formatName.mockReturnValue("FORMATTED NAME");
      mockDb.saveUser.mockRejectedValue(new Error("Save error"));

      // Act & Assert
      await expect(userService.createUser("456", "John Doe")).rejects.toThrow(
        "Save error"
      );
    });
  });
});
