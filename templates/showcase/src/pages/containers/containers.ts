import html from './containers.html';

import { Container, ChangeDetector } from 'nubond';

import { BaseTabContainer } from '../base-tab-container';

//basics
import { HtmlFromFile } from './basics/html-from-file/html-from-file';
import { HtmlFromString } from './basics/html-from-string/html-from-string';
import { HtmlFromFunction } from './basics/html-from-function/html-from-function';
import { HtmlFromPromise } from './basics/html-from-promise/html-from-promise';

import { InOut } from './basics/in-out/in-out';

//projections
import { DefaultProjection } from './projections/default-projection/default-projection';
import { MultiSlotProjection } from './projections/multi-slot-projection/multi-slot-projection';

enum SimpleContainerType { 
    htmlFromFile = 'htmlFromFile',
    htmlFromString = 'HtmlFromString',
    htmlFromFunction = 'HtmlFromFunction',
    htmlFromPromise = 'HtmlFromPromise'
}

@Container(html,
HtmlFromFile, HtmlFromString, HtmlFromFunction, HtmlFromPromise, InOut, //basics
DefaultProjection, MultiSlotProjection //projections
)
export class Containers extends BaseTabContainer {
    public contType: SimpleContainerType = SimpleContainerType.htmlFromFile;
    
    public inOutContainerInput: string | undefined;
    public inOutContainerOutput: number | undefined;

    public advOutContainerOutput: number | undefined;

    constructor(changeDetector: ChangeDetector) {
        super(changeDetector, () => {
            this.updateSimpleContainer();
            this.updateInOutContainer();

            if (this.forceChangeDetection) {
                this.detectChanges();
            }
        });

        this.updateSimpleContainer();
        this.updateInOutContainer();
    }

    public updateSimpleContainer() {
        this.contType = this.randomValue >= 50
                                ? (this.semaphoreValue 
                                        ? SimpleContainerType.htmlFromFile 
                                        : SimpleContainerType.htmlFromString)
                                : (this.semaphoreValue 
                                        ? SimpleContainerType.htmlFromFunction 
                                        : SimpleContainerType.htmlFromPromise);
    }

    public updateInOutContainer() {
        this.inOutContainerInput = `Random value: ${this.randomValue}`;
    }
}