import { Generator } from "./Generator";

/**
 * Represents a component for constructing generators.
 */
export type GeneratorConstructor<TGenerator extends Generator<any, any> = Generator<any, any>> = new (...params: any[]) => TGenerator;
