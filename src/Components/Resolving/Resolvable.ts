import { IGeneratorSettings } from "../../IGeneratorSettings";
import { Generator } from "../../Generator";
import { ResolveValue } from "./ResolveValue";
import { ResolveFunction } from "./ResolveFunction";

/**
 * Represents a resolveable value.
 */
export type Resolvable<TTarget, TSettings, TType> = ResolveValue<TType> | ResolveFunction<TTarget, TSettings, TType>;
