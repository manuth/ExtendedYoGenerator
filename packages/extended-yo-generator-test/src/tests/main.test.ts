import { TestContext } from "../TestContext.js";
import { ComponentTests } from "./Components/index.test.js";
import { TestContextTests } from "./TestContext.test.js";
import { TestGeneratorTests } from "./TestGenerator.test.js";

suite(
    "ExtendedYoGeneratorTest",
    () =>
    {
        TestContextTests();
        TestGeneratorTests(TestContext.Default);
        ComponentTests(TestContext.Default);
    });
