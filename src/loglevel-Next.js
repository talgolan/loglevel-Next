/*
 * loglevel - Modernized
 */

const logMethods = ["trace", "debug", "info", "warn", "error", "dir", "table"];
const noop = () => {};
const undefinedType = "undefined";
const storageKeyPrefix = "loglevel";

let defaultLogger; // Declare here to avoid circular reference

function bindMethod(obj, methodName) {
  return obj[methodName].bind(obj);
}

function createRealMethod(methodName) {
  if (typeof console === undefinedType) return noop;
  return bindMethod(console, methodName) || console.log.bind(console);
}

function defaultMethodFactory(methodName, _level, _loggerName) {
  return createRealMethod(methodName);
}

function createLogger(name = null) {
  const levels = {
    TRACE: 0,
    DEBUG: 1,
    INFO: 2,
    WARN: 3,
    ERROR: 4,
    SILENT: 5,
    DIR: 6,
    TABLE: 7,
  };

  const logger = {
    name,
    levels,
    methodFactory: defaultMethodFactory,
    getLevel: () => userLevel ?? defaultLevel ?? inheritedLevel,
    setLevel: (level, persist = true) => {
      userLevel = normalizeLevel(level);
      if (persist) persistLevel(userLevel);
      replaceLoggingMethods(logger);
    },
    resetLevel: () => {
      userLevel = null;
      clearPersistedLevel();
      replaceLoggingMethods(logger);
    },
    enableAll: (persist = true) => logger.setLevel(levels.TRACE, persist),
    disableAll: (persist = true) => logger.setLevel(levels.SILENT, persist),
  };

  let inheritedLevel = defaultLogger ? defaultLogger.getLevel() : levels.WARN;
  let defaultLevel = null;
  let userLevel = getPersistedLevel();

  replaceLoggingMethods(logger);

  return logger;
}

function replaceLoggingMethods(logger) {
  const level = logger.getLevel();
  logMethods.forEach((methodName, i) => {
    logger[methodName] =
      i < level ? noop : logger.methodFactory(methodName, level, logger.name);
  });
  //logger.log = logger.debug; // Alias for `debug`
}

function persistLevel(levelNum) {
  try {
    localStorage.setItem(
      `${storageKeyPrefix}:${defaultLogger?.name || ""}`,
      String(levelNum)
    );
  } catch {}
}

// function getPersistedLevel() {
//   try {
//     const storedLevel = localStorage.getItem(
//       `${storageKeyPrefix}:${defaultLogger?.name || ""}`
//     );
//     return storedLevel ? parseInt(storedLevel, 10) : null;
//   } catch {
//     return null;
//   }
// }

function getPersistedLevel() {
  try {
    const key = `${storageKeyPrefix}:${this.name || ""}`;
    const storedLevel = localStorage.getItem(key);
    return storedLevel ? parseInt(storedLevel, 10) : null;
  } catch {
    return null;
  }
}

// function clearPersistedLevel() {
//   try {
//     localStorage.removeItem(`${storageKeyPrefix}:${defaultLogger?.name || ""}`);
//   } catch {}
// }

function clearPersistedLevel() {
  try {
    const key = `${storageKeyPrefix}:${this.name || ""}`;
    localStorage.removeItem(key);
  } catch {}
}

function normalizeLevel(level) {
  if (typeof level === "string") {
    const upperLevel = level.toUpperCase();
    if (defaultLogger.levels[upperLevel] !== undefined) {
      return defaultLogger.levels[upperLevel];
    }
  }
  if (
    typeof level === "number" &&
    level >= 0 &&
    level <= defaultLogger.levels.SILENT
  ) {
    return level;
  }
  throw new TypeError(`Invalid logging level: ${level}`);
}

defaultLogger = createLogger(); // Initialize after function definitions

// Exported API
export default defaultLogger;

const loggersByName = {};

export function getLogger(name) {
  if (!name)
    throw new TypeError("You must supply a name when creating a logger.");
  return (loggersByName[name] ??= createLogger(name));
}

export function getLoggers() {
  return loggersByName;
}
