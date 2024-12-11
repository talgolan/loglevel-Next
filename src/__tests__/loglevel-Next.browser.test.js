import getDefaultLogger, { noop } from "../loglevel-Next.js";

describe("loglevel-Next.js - Browser Context Tests", () => {
  let logger;
  const storageKey = "loglevel";

  beforeEach(() => {
    global.localStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };

    logger = getDefaultLogger();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should initialize logger with default level INFO", () => {
    expect(logger.getLevel()).toBe(logger.levels.INFO);
  });

  test("should persist log level to localStorage", () => {
    logger.setLevel("debug", true);
    expect(localStorage.setItem).toHaveBeenCalledWith(storageKey, "DEBUG");
  });

  test("should retrieve log level from localStorage", () => {
    localStorage.getItem.mockReturnValue("DEBUG");
    const newLogger = getDefaultLogger();
    expect(newLogger.getLevel()).toBe(logger.levels.DEBUG);
  });

  test("should clear persisted log level", () => {
    logger.clearPersistedLevel();
    expect(localStorage.removeItem).toHaveBeenCalledWith(storageKey);
  });

  test("should log messages at correct levels", () => {
    const mockConsoleLog = jest.fn();
    global.console = { log: mockConsoleLog };

    logger.setLevel("debug");
    logger.debug("Debug message");
    logger.info("Info message");
    logger.warn("Warn message");

    expect(mockConsoleLog).toHaveBeenCalledWith("Debug message");
    expect(mockConsoleLog).toHaveBeenCalledWith("Info message");
    expect(mockConsoleLog).toHaveBeenCalledWith("Warn message");
  });
});
