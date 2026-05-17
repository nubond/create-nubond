import { Aspect, ElementManipulations, Helpers } from 'nubond';

@Aspect()
export class Tooltip {
    constructor(private _elementManipulations: ElementManipulations) {
    }

    public set data(value: {text: string, placement?: 'left' | 'right' | 'top' | 'bottom'} | string) {
        if (Helpers.isObject(value)) {
            this._elementManipulations.attributes.set('data-tooltip', (<{text: string, placement?: 'left' | 'right' | 'top' | 'bottom'}>value).text);
            this._elementManipulations.attributes.set('data-placement', (<{text: string, placement?: 'left' | 'right' | 'top' | 'bottom'}>value).placement || 'bottom');
        } else {
            this._elementManipulations.attributes.set('data-tooltip', <string>value);
            this._elementManipulations.attributes.set('data-placement', 'bottom');
        }        
    }
}