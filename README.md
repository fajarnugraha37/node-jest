# Setting Up a Node.js TypeScript Application with Jest and Supertest for Unit Testing (ES Modules)

<h1 align="center">
  <a href="https://github.com/fajarnugraha37/node-jest">
    <picture>
      <img height="500" alt="Jest Coverage" src="https://raw.githubusercontent.com/fajarnugraha37/node-jest/refs/heads/main/assets/screenshot.png">
    </picture>
  </a>
</h1>
<p align="center">
  This guide provides a step-by-step process to create a Node.js application using TypeScript with ES Modules, Jest and Supertest for unit testing. By the end, you'll have a fully functional project with a sample application, proper configurations, and example tests.
</p>

---

## Prerequisites

- Node.js (version 18 or higher recommended)
- npm (comes with Node.js) or Yarn
- A code editor (e.g., VS Code)
- Basic knowledge of JavaScript/TypeScript and command-line usage

## Step 1: Initialize the Project

1. Create a project directory:

```bash
mkdir my-typescript-app
cd my-typescript-app
```

2. Initialize a Node.js project: Run the following command to create a package.json file:

```bash
npm init -y
```

3. Set module type to ES Modules: Update package.json to specify "type": "module" to enable ES Modules:

```json
{
  "type": "module"
  // ... other fields
}
```

4. Install TypeScript and Node.js type definitions: Install TypeScript and the Node.js type definitions as development dependencies:

```bash
npm install --save-dev typescript @types/node
```

## Step 2: Configure TypeScript

1. Initialize TypeScript configuration: Create a tsconfig.json file to configure TypeScript:

```bash
npx tsc --init
```

2. Update tsconfig.json: Replace the contents of tsconfig.json with the following configuration for ES Modules:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

Explanation:

- target: Specifies ECMAScript target version.
- module: Uses ESNext for ES Modules.
- moduleResolution: Set to "node" for Node.js module resolution.
- rootDir: Source code directory.
- outDir: Output directory for compiled JavaScript.
- strict: Enables strict type-checking.
- esModuleInterop: Ensures compatibility with ES Modules.
- include/exclude: Specifies which files to compile.

3. Create source directory: Create a src folder for your TypeScript code:

```bash
mkdir src
```

## Step 3: Set Up Jest for Testing

1. Install Jest and TypeScript-related dependencies: Install Jest, TypeScript support for Jest, and type definitions:

```bash
npm install --save-dev jest @types/jest ts-jest
```

2. Configure Jest: Initialize Jest configuration:

```bash
npx ts-jest config:init
```

Update the generated jest.config.js to support ES Modules:

```javascript
/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts"],
  moduleFileExtensions: ["ts", "js", "json"],
  transform: {
    "^.+\\.ts$": ["ts-jest", { useESM: true }],
  },
  extensionsToTreatAsEsm: [".ts"],
};
```

Explanation:

- preset: Uses ts-jest/presets/default-esm for ES Modules support.
- testEnvironment: Sets Node.js as the testing environment.
- roots: Specifies the source directory.
- testMatch: Defines where test files are located.
- transform: Configures ts-jest with ES Modules support.
- extensionsToTreatAsEsm: Treats .ts files as ES Modules.

## Step 4: Add Development Tools

1. Install ts-node and nodemon for development: These tools help run TypeScript files directly and auto-restart the server during development:

```bash
npm install --save-dev ts-node nodemon
```

2. Create nodemon.json: Create a nodemon.json file to configure nodemon for ES Modules:

```json
{
  "watch": ["src"],
  "ext": "ts",
  "exec": "ts-node --esm src/index.ts"
}
```

Note: The --esm flag is added to support ES Modules in ts-node.

## Step 5: Update package.json Scripts

Add scripts to package.json for building, running, and testing the application. Update the "scripts" section:

```json
"scripts": {
  "start": "node dist/index.js",
  "dev": "nodemon",
  "build": "tsc",
  "test": "jest",
  "test:watch": "jest --watch"
}
```

Explanation:

- start: Runs the compiled JavaScript application.
- dev: Runs the app in development mode with auto-restart.
- build: Compiles TypeScript to JavaScript.
- test: Runs Jest tests.
- test:watch: Runs Jest in watch mode for development.

## Step 6: Create a Sample Application

1. Create the main application file: Create src/index.ts with a simple example using ES Modules syntax:

```typescript
import { Calculator } from "./calculator.js";

const calc = new Calculator();
console.log("Sum of 2 + 3:", calc.add(2, 3));
```

2. Create a sample class: Create src/calculator.ts with a basic class:

```typescript
export class Calculator {
  add(a: number, b: number): number {
    return a + b;
  }

  subtract(a: number, b: number): number {
    return a - b;
  }
}
```

## Step 7: Create Sample Tests

Create a test file for the Calculator class in src/calculator.test.ts:

```typescript
import { Calculator } from "./calculator.js";

describe("Calculator", () => {
  let calculator: Calculator;

  beforeEach(() => {
    calculator = new Calculator();
  });

  test("should add two numbers correctly", () => {
    expect(calculator.add(2, 3)).toBe(5);
    expect(calculator.add(-1, 1)).toBe(0);
    expect(calculator.add(0, 0)).toBe(0);
  });

  test("should subtract two numbers correctly", () => {
    expect(calculator.subtract(5, 3)).toBe(2);
    expect(calculator.subtract(3, 5)).toBe(-2);
    expect(calculator.subtract(0, 0)).toBe(0);
  });
});
```

Note: The import uses .js extension for ES Modules compatibility.

## Step 8: Verify the Setup

1. Run the application: Compile and run the application to ensure it works:

```bash
npm run build
npm start
```

You should see the output: Sum of 2 + 3: 5.

2. Run tests: Execute the tests to verify Jest is working:

```bash
npm test
```

Jest should run and show that all tests pass.

3. Run in development mode: Use nodemon to run the app with auto-restart:

```bash
npm run dev
```

## Step 9: Add ESLint for Code Quality (Optional)

1. Install ESLint and TypeScript plugins:

```bash
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

2. Configure ESLint: Create .eslintrc.js with ES Modules support:

```javascript
export default {
  env: {
    node: true,
    jest: true,
    es2021: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  rules: {
    "no-console": "warn",
    "@typescript-eslint/explicit-module-boundary-types": "off",
  },
};
```

3. Add ESLint script: Update package.json scripts:

```json
"lint": "eslint 'src/**/*.{ts,tsx}'",
"lint:fix": "eslint 'src/**/*.{ts,tsx}' --fix"
```

6. Run ESLint:

```bash
npm run lint
```

## Step 10: Project Structure

Your project should now have the following structure:

```plain
my-typescript-app/
├── src/
│   ├── calculator.test.ts
│   ├── calculator.ts
│   ├── index.ts
├── .eslintrc.js
├── jest.config.js
├── nodemon.json
├── package.json
├── tsconfig.json
```

## Step 11: Best Practices and Next Steps

- File extensions in imports: Always include .js in ES Module imports (e.g., import { Calculator } from './calculator.js').
- Organize code: Split code into modules and use consistent naming.
- Add more tests: Write tests for edge cases and error handling.
- Use environment variables: Install dotenv for managing configurations.
- Set up CI/CD: Configure GitHub Actions or another CI tool for automated testing.
- Add code coverage: Update Jest config to include coverage reports:

## Troubleshooting

- Module not found errors: Ensure .js extensions are used in imports and moduleResolution is set to "node" in tsconfig.json.
- Jest issues: Verify ts-jest is configured with useESM: true and the correct preset.
- TypeScript errors: Ensure module is set to "ESNext" and esModuleInterop is enabled.
