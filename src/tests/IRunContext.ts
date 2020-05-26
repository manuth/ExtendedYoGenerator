import { RunContext } from "yeoman-test";

/**
 * Represents the context of a running yeoman-generator.
 */
export interface IRunContext<T> extends RunContext
{
    generator: T;
}