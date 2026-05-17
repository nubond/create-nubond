import html from './in-out.html';
import css from './in-out.scss';

import { Component, EventDispatcher } from 'nubond';

@Component(html, css)
export class InOut {
    private _input: string | undefined;
    public get input(): string | undefined {
        return this._input;
    }
    public set input(value: string | undefined) {
        this._input = value;
    }

    public output = 0;

    constructor(public eventDispatcher: EventDispatcher) {
        eventDispatcher.dispatch('output', this.output);
    }
}