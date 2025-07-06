import { main } from "./index";
import { setImmediate } from "timers/promises";

describe("main", () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  test("should call console.log with the fetched user", async () => {
    await main();
    expect(consoleSpy).toHaveBeenCalledWith(
      "Fetched user:",
      expect.objectContaining({ id: "123", name: "USER 123" })
    );
  });

  test("should not start the main func when NODE_ENV is test", async () => {
    // Arrange
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "test";

    // Act
    jest.isolateModules(() => {
      require("./index");
    });

    await setImmediate(1000);

    // Assert
    expect(consoleSpy).not.toHaveBeenCalled();

    // Cleanup
    process.env.NODE_ENV = originalEnv;
  });

  test("should start the main func when NODE_ENV is not test", async () => {
    // Arrange
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "dev";

    // Act
    jest.isolateModules(() => {
      require("./index");
    });

    await setImmediate(1000);

    // Assert
    expect(consoleSpy).toHaveBeenCalled();

    // Cleanup
    process.env.NODE_ENV = originalEnv;
  });
});
