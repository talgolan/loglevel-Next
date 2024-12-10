import getDefaultLogger from "../loglevel-Next.js";

describe("loglevel-nextjs general tests", () => {
  let logger;

  beforeEach(() => {
    logger = getDefaultLogger();

    // Mock all console methods
    console.trace = jest.fn();
    console.debug = jest.fn();
    console.info = jest.fn();
    console.warn = jest.fn();
    console.error = jest.fn();
    console.dir = jest.fn();
    console.table = jest.fn();
  });

  test("should log at info level by default", () => {
    logger.info("Info message");
    expect(console.info).toHaveBeenCalledWith("Info message");
  });

  test("should not log messages below the current level", () => {
    logger.debug("Debug message");
    expect(console.debug).not.toHaveBeenCalled();
  });

  test("should log trace messages when level is TRACE", () => {
    logger.setLevel("trace");
    logger.trace("Trace message");
    expect(console.trace).toHaveBeenCalledWith("Trace message");
  });

  test("should log dir objects correctly", () => {
    logger.setLevel("dir");
    logger.dir({ key: "value" });
    expect(console.dir).toHaveBeenCalledWith({ key: "value" });
  });

  test("should log table objects correctly", () => {
    logger.table({ key: "value" });
    expect(console.table).toHaveBeenCalledWith({ key: "value" });
  });

  test("should log debug messages when level is DEBUG", () => {
    logger.setLevel("debug");
    logger.debug("Debug message");
    expect(console.debug).toHaveBeenCalledWith("Debug message");
  });

  test("should log warn messages when level is WARN", () => {
    logger.setLevel("warn");
    logger.warn("Warn message");
    expect(console.warn).toHaveBeenCalledWith("Warn message");
  });

  test("should log messages using log alias when level is DEBUG", () => {
    logger.setLevel("debug");
    logger.log("Log message");
    expect(console.debug).toHaveBeenCalledWith("Log message");
  });

  test("should not log any messages when level is SILENT", () => {
    logger.setLevel("silent");

    logger.trace("Trace message");
    logger.debug("Debug message");
    logger.info("Info message");
    logger.warn("Warn message");
    logger.error("Error message");
    logger.dir({ key: "value" });
    logger.table({ key: "value" });

    expect(console.trace).not.toHaveBeenCalled();
    expect(console.debug).not.toHaveBeenCalled();
    expect(console.info).not.toHaveBeenCalled();
    expect(console.warn).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
    expect(console.dir).not.toHaveBeenCalled();
    expect(console.table).not.toHaveBeenCalled();
  });

  test("should throw an error for invalid log levels", () => {
    expect(() => logger.setLevel("invalid")).toThrow(TypeError);
  });

  test("should persist log level to localStorage", () => {
    logger.setLevel("info", true);
    expect(localStorage.setItem).toHaveBeenCalledWith("loglevel", "INFO");
  });

  test("should retrieve persisted log level from localStorage", () => {
    localStorage.setItem("loglevel", "DEBUG");
    const persistedLevel = logger.getPersistedLevel();
    expect(persistedLevel).toBe(logger.levels.DEBUG);
  });

  test("should clear persisted log level from localStorage", () => {
    logger.setLevel("warn", true);
    logger.clearPersistedLevel();
    expect(localStorage.removeItem).toHaveBeenCalledWith("loglevel");
  });
});
