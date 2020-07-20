# ExtendedYoGeneratorTest
Provides tools for testing generators created using `@manuth/extended-yo-generator`

## Getting Started
To get started with `ExtendedYoGeneratorTest`, install the package using following command:

```bash
npm install --save @manuth/extended-yo-generator-test
```

## Usage
The key feature of this package is the `TestContext` class which allows you to spawn new generators easily.

### Creating a `TestContext` object
The `TestContext`-constructor takes one argument `generatorDirectory` which must equal the directory containing the generator:

```ts
import path = require("path");
import { TestContext } from "@manuth/extended-yo-generator-test";
import AppGenerator = require("./generators/app");

let context: TestContext<AppGenerator> = new TestContext(path.join(__dirname, "generators", "app"));
```

### Inspecting the Generator
The `Generator` property allows you to retrieve a default instance of the generator. This allows you to inspect the default settings and default behavior of your generator.

```ts
(
    async () =>
    {
        let generator = await context.Generator;
        console.log(generator.modulePath(".gitignore"));
        console.log(generator.Settings);
    })();
```

### Wrap Values in Promises or Functions
As the `Generator` works with resolvable values quite often, the `TestContext` provides functions for wrapping values into functions or promises.

```ts
let value = "hello world";

(
    async () =>
    {
        console.log(await context.CreatePromise(value));            // Output: "hello world"
        console.log(context.CreateFunction(value)());               // Output: "hello world"
        console.log(await context.CreatePromiseFunction(value)());  // Output: "hello world"
    })();
```

### Executing the Generator
There's a method which allows you to execute a new instance of the generator.

```ts
let runContext = testContext.ExecuteGenerator();
await runContext.toPromise();
```
