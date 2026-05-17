import { Component } from 'nubond';

@Component(
'<div class="root">Hello from <strong>HtmlCssFromString</strong> component with html and css from strings!</div>',
`:host {
    display: block;
    border: 1px solid #6C757D;
}
.root {
    padding: .25rem !important;
}`)
export class HtmlCssFromStrings {
    // public onDispose(): void {
    //     console.log('Component HtmlCssFromStrings disposed');
    // }
}