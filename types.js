"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Add {
}
exports.Add = Add;
class Sub {
}
exports.Sub = Sub;
class Substring {
}
exports.Substring = Substring;
class Multiply {
}
exports.Multiply = Multiply;
class Divide {
}
exports.Divide = Divide;
class Parameter {
    constructor(ctx, methodCall) {
        this.ctx = ctx;
        this.methodCall = methodCall;
    }
}
exports.Parameter = Parameter;
class Closure {
    constructor(data, env) {
        this.data = data;
        this.env = env;
    }
}
exports.Closure = Closure;
class Function {
    constructor(arg1, operand, arg2) {
        this.arg1 = arg1;
        this.operand = operand;
        this.arg2 = arg2;
    }
}
exports.Function = Function;
class Type {
    constructor(args) {
        this.args = args;
    }
}
exports.Type = Type;
class LambdaArg {
    constructor(name, type) {
        this.name = name;
        this.type = type;
    }
}
exports.LambdaArg = LambdaArg;
class Lambda {
    constructor(args, body) {
        this.args = args;
        this.body = body;
    }
}
exports.Lambda = Lambda;
class Field {
    constructor(name, type, body) {
        this.name = name;
        this.type = type;
        this.body = body;
    }
}
exports.Field = Field;
class Method {
    constructor(name, type, ctx, body) {
        this.name = name;
        this.type = type;
        this.ctx = ctx;
        this.body = body;
    }
}
exports.Method = Method;
class FieldUpdate {
    constructor(ctx, propName, type, value) {
        this.ctx = ctx;
        this.propName = propName;
        this.type = type;
        this.value = value;
    }
}
exports.FieldUpdate = FieldUpdate;
class MethodUpdate {
    constructor(ctx, propName, type, newCtx, body) {
        this.ctx = ctx;
        this.propName = propName;
        this.type = type;
        this.newCtx = newCtx;
        this.body = body;
    }
}
exports.MethodUpdate = MethodUpdate;
class Call {
    constructor(ctx, name, args = []) {
        this.ctx = ctx;
        this.name = name;
        this.args = args;
    }
}
exports.Call = Call;
class ObjectType {
    constructor(props) {
        this.props = props;
    }
}
exports.ObjectType = ObjectType;
class Sigma {
    constructor(objectType, call) {
        this.objectType = objectType;
        this.call = call;
    }
}
exports.Sigma = Sigma;
class Expression {
    constructor(ctx, args) {
        this.ctx = ctx;
        this.args = args;
    }
}
exports.Expression = Expression;
class Int {
    constructor(value) {
        this.value = value;
    }
    toString() {
        return this.value.toString();
    }
}
exports.Int = Int;
class Float {
    constructor(value) {
        this.value = value;
    }
    toString() {
        return this.value.toString();
    }
}
exports.Float = Float;
exports.lazy = function (creator) {
    let res;
    let processed = false;
    return function () {
        if (processed)
            return res;
        res = creator.apply(this, arguments);
        processed = true;
        return res;
    };
};
//# sourceMappingURL=types.js.map