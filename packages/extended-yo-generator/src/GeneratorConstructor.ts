import { GeneratorOptions } from "yeoman-generator";
import { Generator } from "./Generator.js";

/**
 * Represents a component for constructing generators.
 *
 * @template TGenerator
 * The type of the generator that can be instantiated.
 */
export type GeneratorConstructor<TGenerator extends Generator<any, any> = Generator<any, any>> = new (args: string | string[], options: GeneratorOptions) => TGenerator;
