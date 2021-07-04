import { Constructor } from "./Constructor";
import { Generator } from "./Generator";

/**
 * Represents a component for constructing generators.
 *
 * @template TGenerator
 * The type of the generator that can be instantiated.
 */
export type GeneratorConstructor<TGenerator extends Generator<any, any> = Generator<any, any>> = Constructor<TGenerator>;
