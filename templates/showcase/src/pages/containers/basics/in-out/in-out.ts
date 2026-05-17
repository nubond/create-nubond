import html from './in-out.html';

import { Container, EventDispatcher } from 'nubond';

@Container(html)
export class InOut {
    public input: string | undefined;
    public output = 0;

    constructor(public eventDispatcher: EventDispatcher) {
        eventDispatcher.dispatch('output', this.output);
    }
}