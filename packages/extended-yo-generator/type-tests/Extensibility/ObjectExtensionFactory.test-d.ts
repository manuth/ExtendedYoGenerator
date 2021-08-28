import { expectType, expectAssignable } from "tsd";
import { Constructor, ObjectExtensionFactory } from "../..";

export class ArrayExtension extends ObjectExtensionFactory.Create(Array)<string>
{
    /**
     * @inheritdoc
     */
    public override get Base()
    {
        return super.Base;
    }
}

export class StrictArrayExtension extends ObjectExtensionFactory.Create<Constructor<Array<number>>>(Array)
{
    /**
     * @inheritdoc
     */
    public override get Base()
    {
        return super.Base;
    }
}

expectType<number[]>(new StrictArrayExtension().Base);
expectAssignable<number[]>(new StrictArrayExtension());
expectAssignable<any[]>(new ArrayExtension().Base);
expectAssignable<string[]>(new ArrayExtension());
