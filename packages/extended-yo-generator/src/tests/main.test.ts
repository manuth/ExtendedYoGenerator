import Path = require("path");
import { TestContext } from "@manuth/extended-yo-generator-test";
import { ComponentsTests } from "./Components";
import { GeneratorTests } from "./Generator";
import { ITestOptions } from "./Generator/ITestOptions";
import { TestGenerator } from "./Generator/TestGenerator/TestGenerator";

suite(
    "ExtendedYoGenerator",
    () =>
    {
        let context = new TestContext<TestGenerator, ITestOptions>(Path.join(__dirname, "Generator", "TestGenerator"));
        ComponentsTests(context);
        GeneratorTests(context);
    });
