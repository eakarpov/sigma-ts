"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isUndefined(obj) {
    return (typeof obj) === 'undefined';
}
function objContains(obj, prop) {
    return obj.hasOwnProperty(prop);
}
function arrRemove(array) {
    // const index = array.findIndex(e => e === item);
    // if (index < 0) {
    //     return false;
    // }
    // array.splice(index, 1);
    if (array.length === 0)
        return false;
    array.pop();
    return true;
}
class Dictionary {
    constructor() {
        this.table = {};
        this.length = 0;
    }
    get(key) {
        const pair = this.table[key.toString()];
        if (isUndefined(pair)) {
            return undefined;
        }
        return pair.value;
    }
    set(key, value) {
        if (isUndefined(key) || isUndefined(value)) {
            return undefined;
        }
        let toReturn;
        const previous = this.table[key.toString()];
        if (isUndefined(previous)) {
            this.length++;
            toReturn = undefined;
        }
        else {
            toReturn = previous.value;
        }
        this.table[key.toString()] = {
            key: key,
            value: value,
        };
        return toReturn;
    }
    remove(key) {
        const previous = this.table[key.toString()];
        if (!isUndefined(previous)) {
            delete this.table[key.toString()];
            this.length--;
            return previous.value;
        }
        return undefined;
    }
    containsKey(key) {
        return !isUndefined(this.get(key));
    }
    size() {
        return this.length;
    }
    isEmpty() {
        return this.length <= 0;
    }
    clear() {
        this.table = {};
        this.length = 0;
    }
}
class MultiDictionary {
    constructor() {
        this.dict = new Dictionary();
    }
    get(key) {
        const values = this.dict.get(key);
        if (isUndefined(values)) {
            return [];
        }
        return values.slice();
    }
    set(key, value) {
        if (isUndefined(key) || isUndefined(value)) {
            return false;
        }
        const array = this.dict.get(key);
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
    remove(key) {
        const array = this.dict.get(key);
        if (!isUndefined(array) && arrRemove(array)) {
            if (array.length === 0) {
                this.dict.remove(key);
            }
            return true;
        }
        return false;
    }
    containsKey(key) {
        return this.dict.containsKey(key);
    }
    size() {
        return this.dict.size();
    }
    isEmpty() {
        return this.dict.isEmpty();
    }
    clear() {
        this.dict.clear();
    }
}
exports.default = MultiDictionary;
exports.context = new MultiDictionary();
//# sourceMappingURL=dictionary.js.map