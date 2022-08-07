import { ObjectExtension, ExtensionConstructor } from "@manuth/extended-yo-generator";
import { expectType } from "tsd";

let baseConstructor: any;

/* Testing extension of ordinary classes with accessors. */
declare class TestClass
{
    get Accessor(): string;
}

class OrdinaryTest extends (baseConstructor as ExtensionConstructor<typeof TestClass, ObjectExtension<typeof TestClass>>)
{ }

/* Testing extension of generic classes with accessors. */
declare class GenericTestClass<T>
{
    get Accessor(): T;
}

class GenericTest extends (baseConstructor as ExtensionConstructor<typeof GenericTestClass, ObjectExtension<typeof GenericTestClass>>)<string>
{
    override get Accessor(): any
    {
        expectType<string>(super.Accessor);
        return null;
    }
}

expectType<string>(new OrdinaryTest().Accessor);
