export interface CustomStateSetMethods {
    add(value: string): void;
    clear(): void;
    delete(value: string): boolean;
    entries(): SetIterator<[string, string]>;
    has(value: string): boolean;
    keys(): SetIterator<string>;
    values(): SetIterator<string>;
}