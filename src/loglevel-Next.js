/*!
 * Fork of loglevel - v1.9.2
 * Original repository: https://github.com/pimterry/loglevel
 * (c) 2013 Tim Perry - licensed MIT
 * (c) 2024 Tal Golan - licensed MIT
 *
 * Modifications by Tal Golan, 2024
 * - Refactored and removed support for legacy browsers.
 * - Modified to support Function Programming via RamdaJS optimizations.
 * - Added support for additional logMethods: [..., 'dir', 'table'].
 */

import * as R from "ramda";

("use strict");

/** Utility function that performs no operation. */
const noop = () => {};

/** Detect if the environment is Internet Explorer. */
const undefinedType = "undefined";
const isIE = R.allPass([
  () => typeof window !== undefinedType,
  () => typeof window.navigator !== undefinedType,
  () => /Trident\/|MSIE /.test(window.navigator.userAgent),
])();

/** Supported logging methods. */
const logMethods = ["trace", "debug", "info", "warn", "error", "dir", "table"];

/**
 * Bind a method to its context, falling back to `apply` if necessary.
 * @param {object} obj - Object containing the method.
 * @param {string} methodName - Name of the method to bind.
 * @returns {Function} - The bound method or noop.
 */
const bindMethod = (obj, methodName) =>
  R.ifElse(
    (method) => typeof method?.bind === "function",
    (method) => method.bind(obj),
    (method) =>
      typeof method === "function"
        ? (...args) => Function.prototype.apply.call(method, obj, args)
        : noop
  )(obj[methodName]);

/**
 * Retrieves the appropriate logging method or a fallback.
 * @param {string} methodName - Name of the logging method.
 * @returns {Function} - The resolved method.
 */
const realMethod = (methodName) => {
  if (typeof console === undefinedType) {
    return noop;
  }

  if (methodName === "debug") {
    return console.log; // Debug falls back to console.log
  }

  if (console[methodName]) {
    return bindMethod(console, methodName);
  }

  return console.log; // Fallback to console.log
};

/**
 * Replaces logging methods of a Logger based on its level.
 * @param {Logger} logger - Logger instance.
 */
const replaceLoggingMethods = (logger) => {
  const level = logger.getLevel();
  logMethods.forEach((methodName, i) => {
    if (methodName === "dir" && level < 5) {
      logger[methodName] = noop; // Explicitly disable `dir` for levels below 5
      console.log(`Forcibly disabling method: ${methodName}`);
    } else if (i < level) {
      logger[methodName] = noop; // Disable methods below the level
      console.log(`Disabling: ${methodName}, Level: ${i}`);
    } else if (console[methodName]) {
      logger[methodName] = (...args) => console[methodName](...args); // Enable methods
      console.log(`Enabling: ${methodName}, Level: ${i}`);
    } else {
      logger[methodName] = noop; // Explicitly disable unsupported methods
      console.log(`Unsupported: ${methodName}, Disabled`);
    }
  });

  logger.log = logger.debug; // Alias log to debug
};

/** Factory for generating logging methods. */
const defaultMethodFactory = (methodName, _level, _loggerName) =>
  realMethod(methodName);

/** Lazy initialization for the default Logger instance. */
let defaultLoggerInstance = null;

/**
 * Logger class to manage logging levels and methods.
 */
class Logger {
  constructor(name, factory) {
    this.name = name;

    this.levels = {
      TRACE: 0,
      DEBUG: 1,
      INFO: 2,
      WARN: 3,
      ERROR: 4,
      DIR: 5,
      TABLE: 6,
      SILENT: 7,
    };
    this.methodFactory = factory || defaultMethodFactory;
    this.storageKey = name ? `loglevel:${name}` : "loglevel";
    this.userLevel = null;
    this.defaultLevel = this.levels.INFO;
    this.inheritedLevel = () =>
      defaultLoggerInstance?.getLevel() ?? this.levels.WARN;

    this.initialize();
  }

  /** Initializes the logger with persisted levels. */
  initialize() {
    this.userLevel = this.getPersistedLevel();
    replaceLoggingMethods(this);
  }

  /** Normalizes logging levels into numeric equivalents. */
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

  /** Persists the logging level. */
  persistLevel(levelNum) {
    if (typeof window === undefinedType || !this.storageKey) return;
    try {
      if (levelNum === this.levels.SILENT) {
        localStorage.setItem(this.storageKey, "SILENT");
      } else {
        localStorage.setItem(
          this.storageKey,
          logMethods[levelNum].toUpperCase()
        );
      }
    } catch (e) {
      if (levelNum === this.levels.SILENT) {
        document.cookie = `${encodeURIComponent(this.storageKey)}=SILENT;`;
      } else {
        document.cookie = `${encodeURIComponent(this.storageKey)}=${logMethods[
          levelNum
        ].toUpperCase()};`;
      }
    }
  }

  /** Retrieves the persisted logging level. */
  getPersistedLevel() {
    if (typeof window === undefinedType || !this.storageKey) return undefined;
    try {
      const level = localStorage.getItem(this.storageKey);
      return level ? this.levels[level.toUpperCase()] : undefined;
    } catch (e) {
      const match = document.cookie.match(
        new RegExp(`(?:^|; )${encodeURIComponent(this.storageKey)}=([^;]*)`)
      );
      return match ? this.levels[match[1].toUpperCase()] : undefined;
    }
  }

  /** Clears the persisted logging level. */
  clearPersistedLevel() {
    if (typeof window === undefinedType || !this.storageKey) return;

    R.tryCatch(
      () => window.localStorage.removeItem(this.storageKey),
      () => {
        document.cookie = `${encodeURIComponent(
          this.storageKey
        )}=; expires=Thu, 01 Jan 1970 00:00:00 UTC`;
      }
    )();
  }

  /** Retrieves the current logging level of the logger. */
  getLevel() {
    const persistedLevel = this.getPersistedLevel();
    const level =
      persistedLevel ??
      this.userLevel ??
      this.defaultLevel ??
      this.inheritedLevel();
    console.log(`getLevel: Returning level ${level}`);
    return level;
  }

  /** Sets the logging level of the logger. */
  setLevel(level, persist = true) {
    const normalizedLevel = this.normalizeLevel(level);
    this.userLevel = normalizedLevel;
    if (persist) {
      this.persistLevel(normalizedLevel);
    }
    replaceLoggingMethods(this);
  }

  /** Enables all logging levels. */
  enableAll(persist = true) {
    this.setLevel(this.levels.TRACE, persist);
  }

  /** Disables all logging levels. */
  disableAll(persist = true) {
    this.setLevel(this.levels.SILENT, persist);
  }
}

/** Lazy initialization and retrieval of the default Logger instance. */
const getDefaultLogger = () => {
  if (!defaultLoggerInstance) {
    defaultLoggerInstance = new Logger();
  }
  return defaultLoggerInstance;
};

/** Export the default logger instance. */
// export default getDefaultLogger();
export default getDefaultLogger;
