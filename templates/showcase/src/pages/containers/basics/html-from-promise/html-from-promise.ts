import { Container } from 'nubond';

@Container({
    get: () => new Promise((resolve, reject) => {
        setTimeout(() => resolve('<div class="p-1">Hello from <strong>HtmlFromPromise</strong> container with html from promise!</div>'), 100);
    })
})
export class HtmlFromPromise {
    // public onDispose(): void {
    //     console.log('Container HtmlFromPromise disposed');
    // }
}