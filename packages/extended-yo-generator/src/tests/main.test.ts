import { TestContext } from "@manuth/extended-yo-generator-test";
import { CollectionTests } from "./Collections";
import { ComponentsTests } from "./Components";
import { ExtendedGeneratorTests } from "./Generator.test";

suite(
    "ExtendedYoGenerator",
    () =>
    {
        let context = TestContext.Default;
        CollectionTests(context);
        ComponentsTests(context);
        ExtendedGeneratorTests(context);
    });
