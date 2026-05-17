import { Container, EventEmitter } from 'nubond';
import { BaseTickEntity } from '../../base-tick-entity';

@Container('<div class="p-1">Hello from <strong>Out</strong> container!</div>')
export class Out extends BaseTickEntity {
    public output = new EventEmitter<number>(0);

    constructor() {
        let counter = 0;
        
        super(() => {
            this.output.emit(counter++);
        });

        this.output.emit(counter++);
    }
}