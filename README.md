# loglevel-Next.js

![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)

A fork of [loglevel](https://github.com/pimterry/loglevel) optimized for modern JavaScript environments, introducing functional programming principles via [Ramda.js](https://ramdajs.com/), additional logging methods, and improved maintainability.

Fork created by: Tal Golan, 2024

---

Minimal lightweight simple logging for JavaScript (browsers, node.js or elsewhere). loglevel extends `console.log()` & friends with level-based logging and filtering, with none of console's downsides.

Loglevel is a barebones reliable everyday logging library. It does not do fancy things, it does not let you reconfigure appenders or add complex log filtering rules, but it does have the all core functionality that you actually use:

## Features

### Simple

- Log things at a given level (trace/debug/info/warn/error) to the `console` object (as seen in all modern browsers & node.js).
- loglevel-Next adds the following levels:
  - dir
  - table
- Filter logging by level (all the above or 'silent'), so you can disable all but error logging in production, and then run `log.setLevel("trace")` in your console to turn it all back on for a furious debugging session.
- Single file, no dependencies, weighs in at 3.4 KB minified and gzipped.

### Effective

- Log methods gracefully fall back to simpler console logging methods if more specific ones aren't available: so calls to `log.debug()` go to `console.debug()` if possible, or `console.log()` if not.
- Logging calls still succeed even if there's no `console` object at all, so your site doesn't break when people visit with old browsers that don't support the `console` object (here's looking at you, IE) and similar.
- This then comes together giving a consistent reliable API that works in every JavaScript environment with a console available, and never breaks anything anywhere else.

### Convenient

- Log output keeps line numbers: most JS logging frameworks call `console.log` methods through wrapper functions, clobbering your stacktrace and making the extra info many browsers provide useless.
- Logging is filtered to "warn" level by default, to keep your live site clean in normal usage (or you can trivially re-enable everything with an initial `log.enableAll()` call).
- Magically handles situations where console logging is not initially available (IE8/9), and automatically enables logging as soon as it does become available (when developer console is opened).
- TypeScript type definitions included, so no need for extra `@types` packages.
- Extensible, to add other log redirection, filtering, or formatting functionality, while keeping all the above (except you will clobber your stacktrace, see [“Plugins”](#plugins) below).

* **Modernized Codebase**:

  - Refactored to remove support for legacy browsers (e.g., IE).
  - Fully ES Module compatible.

* **Functional Programming**:

  - Optimized using [RamdaJS](https://ramdajs.com/) for declarative transformations and error handling.

* **Extended Logging Methods**:

  - Adds support for `dir` and `table` logging methods.

* **Compatibility Improvements**:
  - Works seamlessly in modern browsers and Node.js environments.

---

## Installation

Install the package via npm or yarn:

```bash
npm install loglevel-next
```

or

```bash
yarn add loglevel-next
```

---

## Usage

### Basic Example

```javascript
import log from "loglevel-next";

// Set log level
log.setLevel("info");

// Log messages
log.info("This is an info message");
log.warn("This is a warning");
log.error("This is an error");
log.dir({ foo: "bar" }); // Logs an object
log.table([{ name: "Alice" }, { name: "Bob" }]); // Logs a table
```

### Custom Logger

```javascript
import { Logger } from "loglevel-next";

// Create a custom logger
const customLogger = new Logger("CustomLogger");
customLogger.setLevel("debug");
customLogger.debug("This is a debug message from the custom logger");
```

---

## Logging Levels

| Level  | Description                          |
| ------ | ------------------------------------ |
| TRACE  | Most verbose logging level           |
| DEBUG  | Detailed debugging information       |
| INFO   | General informational messages       |
| WARN   | Warnings about potential issues      |
| ERROR  | Errors that need immediate attention |
| DIR    | Logs object properties in detail     |
| TABLE  | Logs tabular data in table format    |
| SILENT | Disables all logging                 |

---

## API Reference

### Methods

- **`setLevel(level: string | number, persist?: boolean): void`**

  - Sets the logging level. Optionally persists the level across sessions.

- **`getLevel(): number`**

  - Retrieves the current logging level.

- **`enableAll(persist?: boolean): void`**

  - Enables all logging levels.

- **`disableAll(persist?: boolean): void`**

  - Disables all logging levels.

- **`dir(obj: object): void`**

  - Logs an object with detailed properties.

- **`table(data: Array): void`**
  - Logs an array or object in a tabular format.

---

## Acknowledgments

This project is a fork of [loglevel](https://github.com/pimterry/loglevel) by Tim Perry, licensed under the [MIT License](https://github.com/pimterry/loglevel/blob/master/LICENSE).

For additional usage instructions, visit the original [loglevel](https://github.com/pimterry/loglevel) repository.

---

## Modifications in the Fork

- **Refactored Code**: Modernized for ES modules and removed legacy browser support.
- **Functional Programming**: Integrated [Ramda.js](https://ramdajs.com/) for cleaner and more maintainable code.
- **New Logging Methods**: Added `dir` and `table` for advanced logging use cases.

---

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
