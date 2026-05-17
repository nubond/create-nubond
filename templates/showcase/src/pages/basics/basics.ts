import html from './basics.html';

import { Container, ChangeDetector } from 'nubond';

import { BaseTabContainer } from '../base-tab-container';

@Container(html)
export class Basics extends BaseTabContainer {
    public value: string | undefined;
    public html: string | undefined;
    public style: object | undefined;
    public class: object | undefined;
    public attr: string | undefined | null;
    public prop: boolean | undefined | null;
    public event = { click1Count: 0, click2Count: 0, otClick1Count: 0, otClick2Count: 0, dataFromPromise: '' };
    public exec = { count: 0, count2: 0 };
    public if: boolean | undefined;
    public switch: 'one' | 'two' | 'unknown' | undefined;
    public repeat: Array<number> | undefined;
    public outrRpt: Array<number> | undefined;
    public boundElement: Element | undefined;

    constructor(changeDetector: ChangeDetector) {
        super(changeDetector, () => {
            this.updateValue();
            this.updateHtml();
            this.updateStyle();
            this.updateClass();
            this.updateAttributes();
            this.updateProperties();
            this.updateIf();
            this.updateSwitch();
            this.updateRepeat();

            if (this.forceChangeDetection) {
                this.detectChanges();
            }
        });

        this.updateValue();
        this.updateHtml();
        this.updateStyle();
        this.updateClass();
        this.updateAttributes();
        this.updateProperties();
        this.updateIf();
        this.updateSwitch();
        this.updateRepeat();
    }

    //value
    public updateValue() {
        this.value = `Random value: ${this.randomValue}`;
    }

    //html
    public updateHtml() {
        this.html = `<strong><em>Html Random value: ${this.randomValue}</em></strong>`;
    }

    //style
    public updateStyle() {
        if (this.semaphoreValue) {
            this.style = {
                opacity: 0.5,
                color: '#D9269D'
            };
        } else {
            this.style = {
                opacity: 1,
                color: '#7569DA'
            };
        }
    }

    //class
    public updateClass() {
        if (this.semaphoreValue) {
            this.class = {
                simple: 'pico-color-indigo-500',
                condition1: true,
                condition2: false,
                array1: 'pico-color-indigo-500',
                array2: 'text-decoration-underline'
            };
        } else {
            this.class = {
                simple: 'pico-color-fuchsia-500',
                condition1: false,
                condition2: true,
                array1: 'pico-color-indigo-500',
                array2: 'text-decoration-line-through'
            };
        }
    }

    //attr
    public updateAttributes() {
        this.attr = this.semaphoreValue ? null : '';
    }

    //prop
    public updateProperties() {
        this.prop = this.semaphoreValue;
    }

    //event
    public eventClick(event: Event) {
        this.event.click1Count++;
    }

    public eventWithPromise() {
        return this.getPromise()
                   .then(data => this.event.dataFromPromise = data.toString());
    }

    private getPromise(): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            setTimeout(() => resolve(this.randomValue) , 100);
        });
    }

    //if
    public updateIf() {
        this.if = this.semaphoreValue;
    }

    //switch
    public updateSwitch() {
        this.switch = this.semaphoreValue ? 'one' : (this.randomValue % 2 == 0 ? 'two' : 'unknown');
    }

    //repeat
    public updateRepeat() {
        this.repeat = !this.semaphoreValue ? [] : (this.randomValue % 2 == 0 ? [111, this.randomValue] : [111]);
        this.outrRpt = !this.semaphoreValue ? [] : (this.randomValue % 2 == 0 ? [this.randomValue] : [999]);
    }
}