import { TestContext, TestGenerator } from "@manuth/extended-yo-generator-test";
import { CollectionTests } from "./Collections";
import { ComponentsTests } from "./Components";
import { ExtensibilityTests } from "./Extensibility";
import { ExtendedGeneratorTests } from "./Generator.test";

suite(
    "ExtendedYoGenerator",
    () =>
    {
        let context = TestContext.Default;
        CollectionTests(context);
        ComponentsTests(context);
        ExtensibilityTests(context);
        ExtendedGeneratorTests(new TestContext(TestGenerator.Path));
    });
