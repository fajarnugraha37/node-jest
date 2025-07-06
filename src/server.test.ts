import { main } from "./server";
import { app } from "./app";

// Mock the app module
jest.mock('./app', () => ({
  app: {
    listen: jest.fn()
  }
}));

describe('main', () => {
  let mockServer: { close: jest.Mock };
  let consoleLogSpy: jest.SpyInstance;
  let processOnSpy: jest.SpyInstance;
  let processExitSpy: jest.SpyInstance;

  beforeEach(() => {
    // Reset mocks and spies
    jest.clearAllMocks();

    // Mock server object returned by app.listen
    mockServer = {
      close: jest.fn()
    };

    // Mock app.listen to return the mock server
    (app.listen as jest.Mock).mockImplementation((port: number, callback: () => void) => {
      callback();
      return mockServer;
    });

    // Spy on console.log
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    // Spy on process.on to capture event listeners
    // Spy on process.exit)
    processOnSpy = jest.spyOn(process, 'on').mockImplementation((event: string | symbol, listener: (...args: any[]) => void) => {
      return process;
    });

    // Spy on process.exit to prevent actual exit during tests
    processExitSpy = jest.spyOn(process, 'exit').mockImplementation(() => undefined as never);
  });

  afterEach(() => {
    // Restore spies
    consoleLogSpy.mockRestore();
    processOnSpy.mockRestore();
    processExitSpy.mockRestore();
  });

  test('should start server on port 8080 and log message', () => {
    // Act
    main();

    // Assert
    expect(app.listen).toHaveBeenCalledWith(8080, expect.any(Function));
    expect(consoleLogSpy).toHaveBeenCalledWith('listening on port 8080');
  });

  test('should register SIGINT and SIGTERM listeners', () => {
    // Act
    main();

    // Assert
    expect(processOnSpy).toHaveBeenCalledTimes(2);
    expect(processOnSpy).toHaveBeenCalledWith('SIGINT', expect.any(Function));
    expect(processOnSpy).toHaveBeenCalledWith('SIGTERM', expect.any(Function));
  });

  test('should call server.close and log message on SIGINT', () => {
    // Arrange
    main();
    const sigintListener = processOnSpy.mock.calls.find(call => call[0] === 'SIGINT')?.[1] as () => void;

    // Act
    sigintListener();

    // Assert
    expect(mockServer.close).toHaveBeenCalled();
    expect(consoleLogSpy).toHaveBeenCalledWith('Server closed');
  });

  test('should call server.close and log message on SIGTERM', () => {
    // Arrange
    main();
    const sigtermListener = processOnSpy.mock.calls.find(call => call[0] === 'SIGTERM')?.[1] as () => void;

    // Act
    sigtermListener();

    // Assert
    expect(mockServer.close).toHaveBeenCalled();
    expect(consoleLogSpy).toHaveBeenCalledWith('Server closed');
  });

  test('should not start server when NODE_ENV is test', () => {
    // Arrange
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'test';

    // Act
    jest.isolateModules(() => {
      require('./server');
    });

    // Assert
    expect(app.listen).not.toHaveBeenCalled();

    // Cleanup
    process.env.NODE_ENV = originalEnv;
  });
  
  test('should start server when NODE_ENV is not test', () => {
    // Arrange
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'dev';

    // Act
    jest.isolateModules(() => {
      require('./server');
    });

    // Assert
    expect(app.listen).toHaveBeenCalled();

    // Cleanup
    process.env.NODE_ENV = originalEnv;
  });
});