import { TestContextTests } from "./TestContext.test";
import { TestGeneratorTests } from "./TestGenerator.test";

suite(
    "ExtendedYoGeneratorTest",
    () =>
    {
        TestContextTests();
        TestGeneratorTests();
    });
