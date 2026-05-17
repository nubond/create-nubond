import { ChangeDetector } from 'nubond';

import { BaseTickEntity } from './base-tick-entity';

export class BaseTabContainer extends BaseTickEntity {
    //input
    protected static _forceChangeDetection = true;
    public get forceChangeDetection(): boolean {
        return BaseTabContainer._forceChangeDetection;
    }

    public set forceChangeDetection(value: boolean) {
        //console.log(`old force value: ${BaseTabContainer._forceChangeDetection}, new force value: ${value}`);
        BaseTabContainer._forceChangeDetection = value;
    }

    constructor(private _changeDetector: ChangeDetector, tick: () => void) {
        super(tick)
    }

    public detectChanges(): void {
        this._changeDetector.detect();
    }
}