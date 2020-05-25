import { TestContext } from "./TestContext";
import { GeneratorTests } from "./Generator.test";

suite(
    "ExtendedYoGenerator",
    () =>
    {
        let context = new TestContext();

        suiteSetup(
            async () =>
            {
                await context.Initialize();
            });

        suiteTeardown(
            async () =>
            {
                await context.Dispose();
            });

        GeneratorTests(context);
    });