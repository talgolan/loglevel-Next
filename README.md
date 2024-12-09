
# loglevel-Next.js

![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)

A fork of [loglevel](https://github.com/pimterry/loglevel) optimized for modern JavaScript environments, introducing functional programming principles via [Ramda.js](https://ramdajs.com/), additional logging methods, and improved maintainability.

Fork created by: Tal Golan, 2024

---

## Features

- **Modernized Codebase**:
  - Refactored to remove support for legacy browsers (e.g., IE).
  - Fully ES Module compatible.

- **Functional Programming**:
  - Optimized using [RamdaJS](https://ramdajs.com/) for declarative transformations and error handling.

- **Extended Logging Methods**:
  - Adds support for `dir` and `table` logging methods.

- **Compatibility Improvements**:
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
import log from 'loglevel-next';

// Set log level
log.setLevel('info');

// Log messages
log.info('This is an info message');
log.warn('This is a warning');
log.error('This is an error');
log.dir({ foo: 'bar' }); // Logs an object
log.table([{ name: 'Alice' }, { name: 'Bob' }]); // Logs a table
```

### Custom Logger
```javascript
import { Logger } from 'loglevel-next';

// Create a custom logger
const customLogger = new Logger('CustomLogger');
customLogger.setLevel('debug');
customLogger.debug('This is a debug message from the custom logger');
```

---

## Logging Levels

| Level   | Description                           |
|---------|---------------------------------------|
| TRACE   | Most verbose logging level            |
| DEBUG   | Detailed debugging information        |
| INFO    | General informational messages        |
| WARN    | Warnings about potential issues       |
| ERROR   | Errors that need immediate attention  |
| DIR     | Logs object properties in detail      |
| TABLE   | Logs tabular data in table format     |
| SILENT  | Disables all logging                  |

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

---

## Modifications in the Fork

- **Refactored Code**: Modernized for ES modules and removed legacy browser support.
- **Functional Programming**: Integrated [Ramda.js](https://ramdajs.com/) for cleaner and more maintainable code.
- **New Logging Methods**: Added `dir` and `table` for advanced logging use cases.

---

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
