import { AppRoot } from 'nubond';

import { Main } from './pages/main/main'; 

@AppRoot({ 
    showDebugInfo: true
},
'/#[page=main]',
Main
)
export class App {
}