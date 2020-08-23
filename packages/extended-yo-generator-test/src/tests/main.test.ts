import { TestContext } from "../TestContext";
import { ComponentTests } from "./Components";
import { TestContextTests } from "./TestContext.test";
import { TestGeneratorTests } from "./TestGenerator.test";

suite(
    "ExtendedYoGeneratorTest",
    () =>
    {
        TestContextTests();
        TestGeneratorTests();
        ComponentTests(TestContext.Default);
    });
