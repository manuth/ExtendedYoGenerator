import { TestContext } from "./TestContext";
import { GeneratorTests } from "./Generator.test";
import { ComponentsTests } from "./Components";

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