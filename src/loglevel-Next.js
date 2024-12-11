("use strict");
import * as R from "ramda";

export const noop = () => {};
const undefinedType = "undefined";
const isIE = R.allPass([
  () => typeof window !== undefinedType,
  () => typeof window.navigator !== undefinedType,
  () => /Trident\/|MSIE /.test(window.navigator.userAgent),
])();

const logMethods = ["trace", "debug", "info", "warn", "error", "dir", "table"];

const bindMethod = (obj, methodName) => {
  const method = obj[methodName];
  if (typeof method === "function") {
    return method.bind(obj);
  }
  return noop;
};

const realMethod = (methodName) => {
  const getCallerInfo = () => {
    try {
      const error = new Error();
      const stackLines = error.stack?.split("\n");
      // Adjust index to find the caller, skipping Error creation and this function
      return stackLines ? stackLines[3]?.trim() : "Unknown caller";
    } catch {
      return "Unknown caller";
    }
  };

  if (typeof console === undefinedType) {
    return noop;
  }

  if (methodName === "debug") {
    return bindMethod(console, "log");
  }

  if (methodName === "dir") {
    return (data) => {
      const callerInfo = getCallerInfo();
      console.log(`Called from: ${callerInfo}`);
      console.dir(data);
    };
  }

  if (methodName === "table") {
    return (data) => {
      const callerInfo = getCallerInfo();
      if (Array.isArray(data) || typeof data === "object") {
        console.log(`Called from: ${callerInfo}`);
        console.table(data);
      } else {
        console.log("Data is not in a suitable format for table display.");
        console.log(`Called from: ${callerInfo}`);
      }
    };
  }

  if (console[methodName]) {
    return bindMethod(console, methodName);
  }

  return bindMethod(console, "log");
};

/*
const realMethod = (methodName) => {
  if (typeof console === undefinedType) {
    return noop;
  }

  if (methodName === "debug") {
    return bindMethod(console, "log");
  }

  if (methodName === "dir") {
    return (data) => {
      console.dir(data, { depth: null }); // Ensure full depth is displayed
    };
  }

  //   if (methodName === "dir") {
  //     return (data) => {
  //       if (data && typeof data === "object") {
  //         console.log("Expanded object:");
  //         Object.entries(data).forEach(([key, value]) => {
  //           console.log(`${key}:`, value);
  //         });
  //       } else {
  //         console.log("Data is not an object:", data);
  //       }
  //     };
  //   }

  if (methodName === "table") {
    return (data) => {
      if (Array.isArray(data) || typeof data === "object") {
        console.table(data);
      } else {
        console.log("Data is not in a suitable format for table display.");
      }
    };
  }

  if (console[methodName]) {
    return bindMethod(console, methodName);
  }

  return bindMethod(console, "log");
};
*/

function replaceLoggingMethods() {
  if (!this.getLevel) {
    throw new Error("Logger instance has not been initialized properly.");
  }

  const level = this.getLevel();

  logMethods.forEach((methodName, i) => {
    if (methodName === "dir" || methodName === "table") {
      this[methodName] =
        level <= this.levels.WARN
          ? this.methodFactory(methodName, level, this.name)
          : noop;
    } else {
      this[methodName] =
        i < level || level === this.levels.SILENT
          ? noop
          : this.methodFactory(methodName, level, this.name);
    }
  });

  this.log = this.debug;
}

const defaultMethodFactory = (methodName, _level, _loggerName) =>
  realMethod(methodName);

let defaultLoggerInstance = null;

class Logger {
  constructor(name, factory) {
    this.name = name;
    this.levels = {
      TRACE: 0,
      DEBUG: 1,
      INFO: 2,
      WARN: 3,
      ERROR: 4,
      SILENT: 5,
    };
    this.methodFactory = factory || defaultMethodFactory;
    this.storageKey = name ? `loglevel:${name}` : "loglevel";
    this.userLevel = null;
    this.defaultLevel = this.levels.INFO;

    this.initialize();
  }

  initialize() {
    this.userLevel = this.getPersistedLevel();
    replaceLoggingMethods.call(this);
  }

  normalizeLevel = R.cond([
    [
      (level) =>
        typeof level === "string" &&
        this.levels[level.toUpperCase()] !== undefined,
      (level) => this.levels[level.toUpperCase()],
    ],
    [
      (level) =>
        typeof level === "number" && level >= 0 && level <= this.levels.SILENT,
      R.identity,
    ],
    [
      R.T,
      () => {
        throw new TypeError("Invalid log level");
      },
    ],
  ]);

  persistLevel(levelNum) {
    if (typeof window === undefinedType || !this.storageKey) return;
    try {
      const value =
        levelNum === this.levels.SILENT
          ? "SILENT"
          : logMethods[levelNum].toUpperCase();
      localStorage.setItem(this.storageKey, value);
    } catch (e) {
      document.cookie = `${encodeURIComponent(this.storageKey)}=${value};`;
    }
  }

  getPersistedLevel() {
    if (typeof window === undefinedType || !this.storageKey) return undefined;
    try {
      const level = localStorage.getItem(this.storageKey);
      return level ? this.levels[level.toUpperCase()] : undefined;
    } catch (e) {
      return undefined;
    }
  }

  clearPersistedLevel() {
    if (typeof window === undefinedType || !this.storageKey) return;

    try {
      localStorage.removeItem(this.storageKey);
    } catch (e) {
      document.cookie = `${encodeURIComponent(
        this.storageKey
      )}=; expires=Thu, 01 Jan 1970 00:00:00 UTC`;
    }
    this.userLevel = null;
  }

  getLevel() {
    const persistedLevel = this.getPersistedLevel();
    const level = persistedLevel ?? this.userLevel ?? this.defaultLevel;
    return level ?? this.levels.INFO; // Explicitly fallback to INFO
  }

  setLevel(level, persist = true) {
    const normalizedLevel = this.normalizeLevel(level);
    this.userLevel = normalizedLevel;
    if (persist) {
      this.persistLevel(normalizedLevel);
    }
    replaceLoggingMethods.call(this);
  }

  enableAll(persist = true) {
    this.setLevel(this.levels.TRACE, persist);
  }

  disableAll(persist = true) {
    this.setLevel(this.levels.SILENT, persist);
  }
}

const getDefaultLogger = () => {
  if (!defaultLoggerInstance) {
    defaultLoggerInstance = new Logger(null, defaultMethodFactory);
  }
  return defaultLoggerInstance;
};

export default getDefaultLogger;
