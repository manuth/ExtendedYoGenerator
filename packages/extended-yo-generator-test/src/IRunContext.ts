import { RunContext } from "yeoman-test";

/**
 * Represents the context of a running yeoman-generator.
 *
 * @template T
 * The type of the generator.
 */
export interface IRunContext<T> extends RunContext
{
    /**
     * The generator that is being executed.
     */
    generator: T;
}
