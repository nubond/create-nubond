import { Container } from 'nubond';

@Container({
    get: () => '<div class="p-1">Hello from <strong>HtmlFromFunction</strong> container with html from function!</div>'
})
export class HtmlFromFunction {
    // public onDispose(): void {
    //     console.log('Container HtmlFromFunction disposed');
    // }
}