import { Component } from 'nubond';

@Component({
    get: () => '<div class="root">Hello from <strong>HtmlCssFromFunctions</strong> component with html and css from function!</div>'
}, {
    get: () => `:host {
    display: block;
    border: 1px solid #6C757D;
}
.root {
    padding: .25rem !important;
}`})
export class HtmlCssFromFunctions {
    // public onDispose(): void {
    //     console.log('Component HtmlCssFromFunctions disposed');
    // }
}