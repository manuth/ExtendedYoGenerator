import { TestContext, TestGenerator } from "@manuth/extended-yo-generator-test";
import { CollectionTests } from "./Collections/index.js";
import { ComponentsTests } from "./Components/index.js";
import { ExtensibilityTests } from "./Extensibility/index.js";
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
