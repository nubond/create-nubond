import html from './extenders.html';

import { Container, ChangeDetector, $Template } from 'nubond';

import { BaseTabContainer } from '../base-tab-container'; 

$Template('template', 'Hello from Template!');

@Container(html)
export class Extenders extends BaseTabContainer { 
    public aspect: { text: string | undefined } | undefined;
    public transformer: { date: Date, format: 'ISOString' | 'DateString' } | undefined;

    constructor(changeDetector: ChangeDetector) {
        super(changeDetector, () => {
            this.updateAspect();
            this.updateTransformer();

            if (this.forceChangeDetection) {
                this.detectChanges();
            }
        });

        this.updateAspect();
        this.updateTransformer();
    }

    public updateAspect() {
        this.aspect = { text: `Random value: ${this.randomValue}`};
    }

    public updateTransformer(): void {
        const date = new Date();
        date.setDate(date.getDate() + (this.semaphoreValue ? this.randomValue : -this.randomValue))
        this.transformer = { date: date, format: this.semaphoreValue ? 'ISOString' : 'DateString' }
    }
}