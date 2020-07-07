import { ComponentsTests } from "./Components";
import { GeneratorTests } from "./Generator";
import { TestContext } from "./TestContext";

suite(
    "ExtendedYoGenerator",
    () =>
    {
        let context = new TestContext();

        suiteSetup(
            async function()
            {
                this.timeout(0);
                await context.Initialize();
            });

        suiteTeardown(
            async function()
            {
                this.timeout(0);
                await context.Dispose();
            });

        ComponentsTests(context);
        GeneratorTests(context);
    });
