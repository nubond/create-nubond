import html from './execution-expressions.html';

import { Container, ChangeDetector } from 'nubond';

import { BaseTabContainer } from '../base-tab-container'; 

import { Out } from './basic/out';

@Container(html, 
Out
)
export class ExecutionExpressions extends BaseTabContainer {
    public value: string | undefined;
    public transformer: { date: Date, format: 'ISOString' | 'DateString' } | undefined;
    public repeat: Array<number> | undefined;
    public outerRepeat: Array<number> | undefined;
    public boundElement: Element | undefined;
    public outContainerOutput: string | undefined;

    constructor(changeDetector: ChangeDetector) {
        super(changeDetector, () => {
            this.updateValue();
            this.updateTransformer();
            this.updateRepeat();

            if (this.forceChangeDetection) {
                this.detectChanges();
            }
        });

        this.updateValue();
        this.updateTransformer();
        this.updateRepeat();
    }

    //value
    public updateValue() {
        this.value = `Random value: ${this.randomValue}`;
    }

    //transformer
    public updateTransformer(): void {
        const date = new Date();
        date.setDate(date.getDate() + (this.semaphoreValue ? this.randomValue : -this.randomValue))
        this.transformer = { date: date, format: this.semaphoreValue ? 'ISOString' : 'DateString' }
    }

    //repeat
    public updateRepeat() {
        this.repeat = this.semaphoreValue ? [111, this.randomValue] : [this.randomValue, 111];
        this.outerRepeat = this.semaphoreValue ? [999, this.randomValue] : [this.randomValue, 999];
    }
}