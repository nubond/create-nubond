import html from './dependency-injections.html';

import { Container, ChangeDetector } from 'nubond';

import { BaseTabContainer } from '../base-tab-container'; 


@Container(html)
export class DependencyInjections extends BaseTabContainer { 
    constructor(changeDetector: ChangeDetector) {
        super(changeDetector, () => {
            //add code here

            if (this.forceChangeDetection) {
                this.detectChanges();
            }
        });

        //add code here
    }
}