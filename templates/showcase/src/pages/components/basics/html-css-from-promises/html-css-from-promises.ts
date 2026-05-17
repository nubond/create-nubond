import { Component } from 'nubond';

@Component({
    get: async () => {
        return '<div class="root">Hello from <strong>HtmlCssFromPromises</strong> component with html and css from promise!</div>';
    }
}, {
    get: () => new Promise((resolve, reject) => {
        setTimeout(() => resolve(`:host {
                                    display: block;
                                    border: 1px solid #6C757D;
                                 }
                                 .root {
                                    padding: .25rem !important;
                                 }`), 100);
    })
})
export class HtmlCssFromPromises {
    // public onDispose(): void {
    //     console.log('Component HtmlCssFromPromises disposed');
    // }
}