import getDefaultLogger from "../loglevel-Next.js";

const noop = () => {}; // Define noop for testing

describe("loglevel-nextjs in browser context", () => {
  let logger;

  beforeEach(() => {
    logger = getDefaultLogger();

    // Explicitly mock all console methods
    console.trace = jest.fn();
    console.debug = jest.fn();
    console.info = jest.fn();
    console.warn = jest.fn();
    console.error = jest.fn();
    console.dir = jest.fn();
    console.table = jest.fn();
    console.log = jest.fn(); // Add fallback mock
  });

  const logLevels = [
    {
      level: "trace",
      methods: ["trace", "debug", "info", "warn", "error", "dir", "table"],
    },
    {
      level: "debug",
      methods: ["debug", "info", "warn", "error", "dir", "table"],
    },
    { level: "info", methods: ["info", "warn", "error", "dir", "table"] },
    { level: "warn", methods: ["warn", "error", "dir", "table"] },
    { level: "error", methods: ["error"] },
    { level: "dir", methods: ["dir", "table"] },
    { level: "table", methods: ["table"] },
    { level: "silent", methods: [] },
  ];

  logLevels.forEach(({ level, methods }) => {
    test(`should correctly log at level: ${level}`, () => {
      logger.setLevel(level);

      const allMethods = [
        "trace",
        "debug",
        "info",
        "warn",
        "error",
        "dir",
        "table",
      ];
      allMethods.forEach((method) => {
        logger[method](`${method} message`);

        if (methods.includes(method)) {
          expect(console[method]).toHaveBeenCalledWith(`${method} message`);
        } else {
          if (console[method].mock.calls.length > 0) {
            console.log(
              `Unexpected call to ${method}. Mock calls:`,
              console[method].mock.calls
            );
          }
          expect(console[method]).not.toHaveBeenCalled();
        }
      });

      jest.clearAllMocks();
    });
  });

  test("manual check for logger.dir", () => {
    logger.setLevel("error");
    expect(logger.dir.name).toBe("noop"); // Verify `dir` is correctly replaced
  });

  test("should log nothing at SILENT level", () => {
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
});
