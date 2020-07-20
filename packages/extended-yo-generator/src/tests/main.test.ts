import { TestContext } from "@manuth/extended-yo-generator-test";
import { ComponentsTests } from "./Components";
import { GeneratorTests } from "./Generator";

suite(
    "ExtendedYoGenerator",
    () =>
    {
        let context = TestContext.Default;
        ComponentsTests(context);
        GeneratorTests(context);
    });
