export class BaseTickEntity {
    protected semaphoreValue: boolean = true;
    protected randomValue: number = 0;

    constructor(tick: () => void) {
        setInterval(() => {
            this.semaphoreValue = !this.semaphoreValue;
            this.randomValue = Math.floor(Math.random() * 100);

            tick();
        }, 1000);
    }
}