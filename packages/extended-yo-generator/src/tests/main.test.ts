import { TestContext, TestGenerator } from "@manuth/extended-yo-generator-test";
import { CollectionTests } from "./Collections/index.test.js";
import { ComponentsTests } from "./Components/index.test.js";
import { ExtensibilityTests } from "./Extensibility/index.test.js";
import { ExtendedGeneratorTests } from "./Generator.test.js";

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
