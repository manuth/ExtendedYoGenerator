import { TestContext } from "@manuth/extended-yo-generator-test";
import { ComponentsTests } from "./Components";
import { ExtendedGeneratorTests } from "./GeneratorTests.test";

suite(
    "ExtendedYoGenerator",
    () =>
    {
        let context = TestContext.Default;
        ComponentsTests(context);
        ExtendedGeneratorTests(context);
    });
