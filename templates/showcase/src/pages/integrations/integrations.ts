import html from './integrations.html';

import { Container, ChangeDetector } from 'nubond';

import { BaseTabContainer } from '../base-tab-container'; 


@Container(html)
export class Integrations extends BaseTabContainer {
    public interpolated = 'Hello from interpolated';
    
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