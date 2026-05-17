import html from './components.html';

import { Container, ChangeDetector } from 'nubond';

import { BaseTabContainer } from '../base-tab-container';

//basics
import { HtmlCssFromFiles } from './basics/html-css-from-files/html-css-from-files';
import { HtmlCssFromStrings } from './basics/html-css-from-strings/html-css-from-strings';
import { HtmlCssFromFunctions } from './basics/html-css-from-functions/html-css-from-functions'; 
import { HtmlCssFromPromises } from './basics/html-css-from-promises/html-css-from-promises';
import { InOut } from './basics/in-out/in-out';

//projections
import { DefaultProjection } from './projections/default-projection/default-projection';
import { MultiSlotProjection } from './projections/multi-slot-projection/multi-slot-projection';

@Container(html,
HtmlCssFromFiles, HtmlCssFromStrings, HtmlCssFromFunctions, HtmlCssFromPromises, InOut, //basics
DefaultProjection, MultiSlotProjection //projections
)
export class Components extends BaseTabContainer {
    public inOutComponentInput: string | undefined;
    public inOutComponentOutput: number | undefined;

    public advOutContainerOutput: number | undefined;

    constructor(changeDetector: ChangeDetector) {
        super(changeDetector, () => {
            this.updateInOutComponent();

            if (this.forceChangeDetection) {
                this.detectChanges();
            }
        });

        this.updateInOutComponent();
    }

    public updateInOutComponent() {
        this.inOutComponentInput = `Random value: ${this.randomValue}`;
    }
}