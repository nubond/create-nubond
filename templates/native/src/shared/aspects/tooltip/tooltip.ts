import css from './tooltip.scss';

import { Aspect, ElementManipulations, Helpers } from 'nubond';

@Aspect(css)
export class Tooltip {
    constructor(private _elementManipulations: ElementManipulations) {
    }

    public set data(value: { text: string, placement?: 'left' | 'right' | 'top' | 'bottom' } | string) {
        if (Helpers.isObject(value)) {
            this._elementManipulations.attributes.set('tooltip', (<{text: string, placement?: 'left' | 'right' | 'top' | 'bottom'}>value).text);
            this._elementManipulations.attributes.set('placement', (<{text: string, placement?: 'left' | 'right' | 'top' | 'bottom'}>value).placement || 'top');
        } else {
            this._elementManipulations.attributes.set('tooltip', <string>value);
            this._elementManipulations.attributes.set('placement', 'top');
        }        
    }
}