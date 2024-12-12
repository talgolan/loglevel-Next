import defaultLogger, { getLogger } from "../loglevel-Next";

describe("loglevel-Next - Browser Tests", () => {
  let localStorageMock;
  let consoleMock;

  beforeEach(() => {
    // Mock localStorage
    localStorageMock = (() => {
      let store = {};
      return {
        getItem: jest.fn((key) => store[key] || null),
        setItem: jest.fn((key, value) => {
          store[key] = value;
        }),
        removeItem: jest.fn((key) => {
          delete store[key];
        }),
        clear: jest.fn(() => {
          store = {};
        }),
      };
    })();
    Object.defineProperty(global, "localStorage", {
      value: localStorageMock,
      configurable: true,
      writable: true,
    });

    // Mock console methods
    consoleMock = {
      trace: jest.fn(),
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      dir: jest.fn(),
      table: jest.fn(),
    };
    global.console = consoleMock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Default Logger", () => {
    test("persists log level TRACE to localStorage", () => {
      defaultLogger.setLevel("trace", true);
      expect(localStorageMock.setItem).toHaveBeenCalledWith("loglevel:", "0");
    });

    test("disables persistence when persist=false", () => {
      defaultLogger.setLevel("debug", false);
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });

    test("persists log level DEBUG to localStorage", () => {
      defaultLogger.setLevel("debug", true);
      expect(localStorageMock.setItem).toHaveBeenCalledWith("loglevel:", "1");
    });

    test("disables persistence when persist=false", () => {
      defaultLogger.setLevel("debug", false);
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });

    test("persists log level INFO localStorage", () => {
      defaultLogger.setLevel("info", true);
      expect(localStorageMock.setItem).toHaveBeenCalledWith("loglevel:", "2");
    });

    test("disables persistence when persist=false", () => {
      defaultLogger.setLevel("info", false);
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });

    test("persists log level WARN localStorage", () => {
      defaultLogger.setLevel("warn", true);
      expect(localStorageMock.setItem).toHaveBeenCalledWith("loglevel:", "3");
    });

    test("disables persistence when persist=false", () => {
      defaultLogger.setLevel("warn", false);
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });

    test("persists log level ERROR localStorage", () => {
      defaultLogger.setLevel("error", true);
      expect(localStorageMock.setItem).toHaveBeenCalledWith("loglevel:", "4");
    });

    test("disables persistence when persist=false", () => {
      defaultLogger.setLevel("error", false);
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });

    test("persists log level SILENT localStorage", () => {
      defaultLogger.setLevel("silent", true);
      expect(localStorageMock.setItem).toHaveBeenCalledWith("loglevel:", "5");
    });

    test("disables persistence when persist=false", () => {
      defaultLogger.setLevel("silent", false);
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });
  });

  describe("Edge Cases", () => {
    test("does not throw when localStorage is unavailable", () => {
      Object.defineProperty(global, "localStorage", { value: null });
      expect(() => defaultLogger.setLevel("debug", true)).not.toThrow();
    });

    test("does not persist if localStorage throws an error", () => {
      jest.spyOn(global.localStorage, "setItem").mockImplementation(() => {
        throw new Error("Storage quota exceeded");
      });
      expect(() => defaultLogger.setLevel("info", true)).not.toThrow();
    });
  });
});
