import { GeneratorComponent } from "../Components/GeneratorComponent";
import { Constructor } from "../Constructor";

/**
 * Represents an extension of a {@link GeneratorComponent `GeneratorComponent<TSettings, TOptions, TResolved>`}.
 */
export abstract class GeneratorComponentExtension<T extends Constructor<GeneratorComponent<any, any, any>>>
{
    /**
     * @inheritdoc
     */
    public abstract get BaseGenerator(): InstanceType<T>["Generator"];
}
