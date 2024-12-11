import getDefaultLogger, { noop } from "../loglevel-Next.js";

describe("loglevel-Next.js Tests", () => {
  let logger;

  beforeEach(() => {
    logger = getDefaultLogger();
  });

  test("should initialize logger with default level INFO", () => {
    expect(logger.getLevel()).toBe(logger.levels.INFO);
  });

  test("should initialize logger methods correctly", () => {
    expect(typeof logger.info).toBe("function");
    expect(typeof logger.warn).toBe("function");
    expect(typeof logger.error).toBe("function");
    expect(typeof logger.debug).toBe("function");
    expect(typeof logger.dir).toBe("function");
    expect(typeof logger.table).toBe("function");
  });

  test("should change the logging level", () => {
    logger.setLevel("debug");
    expect(logger.getLevel()).toBe(logger.levels.DEBUG);
  });

  test("should enable all levels with enableAll", () => {
    logger.enableAll();
    expect(logger.getLevel()).toBe(logger.levels.TRACE);
  });

  test("should disable all levels with disableAll", () => {
    logger.disableAll();
    expect(logger.getLevel()).toBe(logger.levels.SILENT);
  });

  test("should throw an error for invalid log level", () => {
    expect(() => logger.setLevel("invalid")).toThrow(TypeError);
  });

  test("should allow 'dir' and 'table' at TRACE level", () => {
    logger.setLevel("trace");
    expect(logger.dir).not.toBe(noop);
    expect(logger.table).not.toBe(noop);
  });

  test("should allow 'dir' and 'table' at DEBUG level", () => {
    logger.setLevel("debug");
    expect(logger.dir).not.toBe(noop);
    expect(logger.table).not.toBe(noop);
  });

  test("should disable 'dir' and 'table' at SILENT level", () => {
    logger.setLevel("silent");
    expect(logger.dir).toBe(noop);
    expect(logger.table).toBe(noop);
  });

  test("should persist the logging level", () => {
    logger.setLevel("warn", true);
    const newLogger = getDefaultLogger();
    expect(newLogger.getLevel()).toBe(newLogger.levels.WARN);
  });

  test("should fallback to noop when console is undefined", () => {
    const originalConsole = global.console;
    global.console = undefined;
    const testLogger = getDefaultLogger();
    expect(typeof testLogger.debug).toBe("function");
    global.console = originalConsole;
  });
});
