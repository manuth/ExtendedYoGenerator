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

### Testing Generator-Components
If you want to test generator-components such as file-mappings or questions,
you might want to use the `TestContext.Default`-context for injecting said components.

```ts
import { TestContext } from "@manuth/extended-yo-generator-test";

let testContext = TestContext.Default;

testContext.ExecuteGenerator(
    {
        FileMappings: [
            new MyCustomFileMapping()
        ]
    });
```

### Testing File-Mappings
You might want to make assertions about the content of file-mappings or check the integrity of resulting `.json` or `.js`-files.

The new classes `FileMappingTester`, `JavaScriptFileMappingTester` and `JSONFileMappingTester` might fit your needs perfectly.

```ts
import Assert = require("assert");
import { TestContext, FileMappingTester } from "@manuth/extended-yo-generator-test";

let tester = new FileMappingTester(await TestContext.Default.Generator, new MyCustomFileMapping());

await tester.Run(); // Execute the file-mapping and commit the result to the file-system
await tester.AssertContent("expected content"); // or
Assert.strictEqual(await tester.Content, "expected content");
```

#### JSONFileMappingTester
The `JSONFileMappingTester` parses the content of the destination-file and allows you to make assertions about the metadata.

```ts
import Assert = require("assert");
import { TestContext, JSONFileMappingTester } from "@manuth/extended-yo-generator-test";

let tester = new JSONFileMappingTester(await TestContext.Default.Generator, new MyCustomFileMapping());

await tester.Run();
Assert.strictEqual((await tester.Metadata).name, "my-awesome-module");
```

#### JavaScriptFilemappingTester
Using thie file-mapping tester you can check whether the destination-file exports the expected members. This is especially useful because the file is automatically deleted from the require-cache in order to hot-reload changes made to the destination-file.

```ts
import Assert = require("assert");
import { TestContext, JavaScriptFileMappingTester } from "@manuth/extended-yo-generator-test";

let tester = new JavaScriptFileMappingTester(await TestContext.Default.Generator, new MyCustomFileMapping());

await tester.WriteDestination("module.exports = 1;");
console.log(await tester.Require()); // logs `1`
await tester.WriteDestination("module.exports = 2;");
console.log(await tester.Require()); // logs `2` as the content of the destination-file has been hot-reloaded
```
