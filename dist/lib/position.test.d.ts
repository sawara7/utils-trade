import { BasePositionClass } from "..";
export declare class TestPositionClass extends BasePositionClass {
    doOpen(): Promise<string>;
    doClose(): Promise<string>;
    doCancel(): Promise<void>;
    doLosscut(): Promise<void>;
}
