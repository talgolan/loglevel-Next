import defaultLogger, { getLogger, getLoggers } from "../loglevel-Next";

describe("loglevel-Next - General Tests", () => {
  let consoleMock;

  beforeEach(() => {
    // Mock console methods
    consoleMock = {
      trace: jest.fn(),
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      dir: jest.fn(),
      table: jest.fn(),
      log: jest.fn(),
    };
    global.console = consoleMock;
  });

  afterEach(() => {
    defaultLogger.resetLevel(); // Reset logger to default state
    jest.clearAllMocks(); // Clear mock calls
  });

  describe("Default Logger", () => {
    test("logs messages at default level (warn)", () => {
      defaultLogger.setLevel("warn"); // Explicitly set the level
      defaultLogger.warn("Warning message");
      defaultLogger.error("Error message");
      expect(consoleMock.warn).toHaveBeenCalledWith("Warning message");
      expect(consoleMock.error).toHaveBeenCalledWith("Error message");
    });

    test("does not log messages below the default level (warn)", () => {
      defaultLogger.info("Info message");
      defaultLogger.debug("Debug message");
      expect(consoleMock.info).not.toHaveBeenCalled();
      expect(consoleMock.debug).not.toHaveBeenCalled();
    });

    test("allows setting a custom log level", () => {
      defaultLogger.setLevel("info");
      defaultLogger.info("Info message");
      defaultLogger.debug("Debug message");
      expect(consoleMock.info).toHaveBeenCalledWith("Info message");
      expect(consoleMock.debug).not.toHaveBeenCalled();
    });

    test("disables all logs", () => {
      defaultLogger.disableAll();
      defaultLogger.error("This error should not be logged");
      expect(consoleMock.error).not.toHaveBeenCalled();
    });

    test("enables all logs", () => {
      defaultLogger.enableAll();
      defaultLogger.trace("Trace message");
      expect(consoleMock.trace).toHaveBeenCalledWith("Trace message");
    });
  });

  describe("Custom Loggers", () => {
    let customLogger;

    beforeEach(() => {
      customLogger = getLogger("CustomLogger");
    });

    test("creates a named logger", () => {
      expect(customLogger.name).toBe("CustomLogger");
    });

    test("has independent log levels", () => {
      customLogger.setLevel("info");
      customLogger.info("Custom info message");
      customLogger.debug("Custom debug message");
      expect(consoleMock.info).toHaveBeenCalledWith("Custom info message");
      expect(consoleMock.debug).not.toHaveBeenCalled();
    });

    test("does not affect the default logger's level", () => {
      defaultLogger.setLevel("warn");
      customLogger.setLevel("info");

      defaultLogger.info("Default info message");
      customLogger.info("Custom info message");
      expect(consoleMock.info).toHaveBeenCalledTimes(1);
      expect(consoleMock.info).toHaveBeenCalledWith("Custom info message");
    });

    test("allows dynamic level changes", () => {
      customLogger.setLevel("error");
      customLogger.warn("Custom warning message");
      expect(consoleMock.warn).not.toHaveBeenCalled();

      customLogger.setLevel("warn");
      customLogger.warn("Custom warning message");
      expect(consoleMock.warn).toHaveBeenCalledWith("Custom warning message");
    });
  });

  describe("Logging Methods", () => {
    test("logs trace, debug, info, warn, and error", () => {
      defaultLogger.enableAll();
      defaultLogger.trace("Trace");
      defaultLogger.debug("Debug");
      defaultLogger.info("Info");
      defaultLogger.warn("Warn");
      defaultLogger.error("Error");

      expect(consoleMock.trace).toHaveBeenCalledWith("Trace");
      expect(consoleMock.debug).toHaveBeenCalledWith("Debug");
      expect(consoleMock.info).toHaveBeenCalledWith("Info");
      expect(consoleMock.warn).toHaveBeenCalledWith("Warn");
      expect(consoleMock.error).toHaveBeenCalledWith("Error");
    });

    test("handles additional methods like dir and table", () => {
      defaultLogger.enableAll();
      defaultLogger.dir({ key: "value" });
      defaultLogger.table(["Row1", "Row2"]);

      expect(consoleMock.dir).toHaveBeenCalledWith({ key: "value" });
      expect(consoleMock.table).toHaveBeenCalledWith(["Row1", "Row2"]);
    });
  });

  describe("getLoggers Functionality", () => {
    test("retrieves all created loggers", () => {
      const loggerA = getLogger("LoggerA");
      const loggerB = getLogger("LoggerB");
      const loggers = getLoggers();

      expect(loggers.LoggerA).toBe(loggerA);
      expect(loggers.LoggerB).toBe(loggerB);
    });
  });

  describe("Edge Cases", () => {
    test("throws an error when creating a logger without a name", () => {
      expect(() => getLogger()).toThrow(
        new TypeError("You must supply a name when creating a logger.")
      );
    });

    test("throws an error for invalid log levels", () => {
      expect(() => defaultLogger.setLevel("invalid")).toThrow(
        new TypeError("Invalid logging level: invalid")
      );
    });
  });
});
