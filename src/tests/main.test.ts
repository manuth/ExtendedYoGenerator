import { ComponentsTests } from "./Components";
import { GeneratorTests } from "./Generator.test";
import { TestContext } from "./TestContext";

suite(
    "ExtendedYoGenerator",
    () =>
    {
        let context = new TestContext();

        suiteSetup(
            async function()
            {
                this.enableTimeouts(false);
                await context.Initialize();
            });

        suiteTeardown(
            async function()
            {
                this.enableTimeouts(false);
                await context.Dispose();
            });

        ComponentsTests(context);
        GeneratorTests(context);
    });
