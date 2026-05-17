import html from './main.html';

import { Container } from 'nubond';

import { HelloWorld } from './components/hello-world/hello-world';

@Container(html,
    HelloWorld
)
export class Main {
}