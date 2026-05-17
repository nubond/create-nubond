import html from './html-css-from-files.html';
import css from './html-css-from-files.scss';

import { Component } from 'nubond';

@Component(html, css)
export class HtmlCssFromFiles {
    // public onDispose(): void {
    //     console.log('Component HtmlCssFromFiles disposed');
    // }
}