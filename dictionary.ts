import { 
    ObjectType, Call, Lambda, Int, Float, Expression,
 } from './types';

export interface DictionaryPair<K, V> {
    key: K;
    value: V;
}

function isUndefined(obj: any): obj is undefined {
    return (typeof obj) === 'undefined';
}

function objContains(obj: object, prop: string) {
    return obj.hasOwnProperty(prop);
}

function arrRemove<T>(array: T[], item: T): boolean {
    const index = array.findIndex(e => e === item);
    if (index < 0) {
        return false;
    }
    array.splice(index, 1);
    return true;
}

class Dictionary<K, V> {
    protected table: { [key: string]: DictionaryPair<K, V> };
    protected length: number;

    constructor() {
        this.table = {};
        this.length = 0;
    }

    get(key: K): V | undefined {
        const pair: DictionaryPair<K, V> = this.table[key.toString()];
        if (isUndefined(pair)) {
            return undefined;
        }
        return pair.value;
    }

    set(key: K, value: V): V | undefined {
        if (isUndefined(key) || isUndefined(value)) {
            return undefined;
        }
        let toReturn: V | undefined;
        const previous: DictionaryPair<K, V> = this.table[key.toString()];
        if (isUndefined(previous)) {
            this.length++;
            toReturn = undefined;
        } else {
            toReturn = previous.value;
        }
        this.table[key.toString()] = {
            key: key,
            value: value,
        };
        return toReturn;
    }

    remove(key: K): V | undefined {
        const previous: DictionaryPair<K, V> = this.table[key.toString()];
        if (!isUndefined(previous)) {
            delete this.table[key.toString()];
            this.length--;
            return previous.value;
        }
        return undefined;
    }
    
    containsKey(key: K): boolean {
        return !isUndefined(this.get(key))
    }

    size(): number {
        return this.length;
    }

    isEmpty(): boolean {
        return this.length <= 0;
    }

    clear(): void {
        this.table = {};
        this.length = 0;
    }
}

export default class MultiDictionary<K, V> {
    private dict: Dictionary<K, Array<V>>;

    constructor() {
        this.dict = new Dictionary<K, Array<V>>();
    }

    get(key: K): V[] {
        const values: Array<V>|undefined = this.dict.get(key);
        if (isUndefined(values)) {
            return [];
        }
        return values.slice();
    }
    
    set(key: K, value: V): boolean {
        if (isUndefined(key) || isUndefined(value)) {
            return false;
        }
        const array: Array<V>|undefined = this.dict.get(key);
        if (isUndefined(array)) {
            this.dict.set(key, [value]);
            return true;
        }
        if (array.includes(value)) {
            return false;
        }
        array.push(value);
        return true;
    }

    remove(key: K, value?: V): boolean {
        if (isUndefined(value)) {
            const v = this.dict.remove(key);
            return !isUndefined(v);
        }
        const array = this.dict.get(key);
        if (!isUndefined(array) && arrRemove(array, value)) {
            if (array.length === 0) {
                this.dict.remove(key);
            }
            return true;
        }
        return false;
    }

    containsKey(key: K): boolean {
        return this.dict.containsKey(key);
    }

    size(): number {
        return this.dict.size();
    }

    isEmpty(): boolean {
        return this.dict.isEmpty();
    }

    clear(): void {
        this.dict.clear();
    }
}

export type ContextType = ObjectType | string | number | boolean | Call | Lambda | Int | Float | Expression;
export const context = new MultiDictionary<string, ContextType>();
