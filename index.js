"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const objects_1 = require("./objects");
const types_1 = require("./types");
const dictionary_1 = require("./dictionary");
function findMethod(object, name) {
    for (const method of object.props) {
        if (method.name === name)
            return method;
    }
}
function setMethod(ctx, name) {
    const res = new types_1.ObjectType([]);
    for (let i = 0; i < ctx.props.length; i++) {
        if (ctx.props[i].name === name.name) {
            res.props.push(name);
        }
        else {
            res.props.push(ctx.props[i]);
        }
    }
    return res;
}
function evalLambda(body, args) {
    body.args.forEach((arg, i) => {
        if (args && args[i]) {
            dictionary_1.context.set(arg.name, args[i]);
        }
    });
    return evalExpr(body.body);
}
function evalBody(body, args) {
    if (body instanceof types_1.Lambda) {
        return evalLambda(body, args);
    }
    if (body instanceof types_1.Expression) {
        return evalExpr(body);
    }
    if (body instanceof types_1.ObjectType) {
        return body;
    }
    return body;
}
function evalParam(param) {
    if (param.methodCall) {
        return methodCall(param.methodCall);
    }
    if (typeof param === 'string') {
        const res = dictionary_1.context.get(param)[dictionary_1.context.get(param).length - 1];
        if (res instanceof types_1.ObjectType) {
            return res;
        }
        if (res instanceof types_1.Int || res instanceof types_1.Float) {
            return res;
        }
        throw new Error('Not a valid type');
    }
    else {
        if (param instanceof types_1.ObjectType) {
            return param;
        }
        if (param instanceof types_1.Int || param instanceof types_1.Float) {
            return param;
        }
        return dictionary_1.context.get(param.ctx)[dictionary_1.context.get(param.ctx).length - 1];
    }
}
function evalExprBodies(body) {
    let res = new types_1.Int(0);
    // console.log(body);
    body.forEach(b => {
        res = evalExprBody(b);
    });
    return res;
}
function getNewMethod(method, ctx, mupdate) {
    // console.log(body);
    const bodyB = types_1.lazy(() => a(mupdate));
    const bodyC = typeof method.ctx === 'string' ? bodyB() : bodyB;
    if (method.body instanceof types_1.Expression) {
        const body = evalExprBodies(method.body.args);
        if (body instanceof types_1.ObjectType) {
            return new types_1.Method(method.name, method.type, method.ctx, bodyC);
            // } else {
            //     throw new Error('ObjectType expected');
        }
    }
    else if (method.body instanceof types_1.Lambda) {
        return new types_1.Method(method.name, method.type, ctx, bodyC);
    }
    return method;
}
function c(value) {
    if (value instanceof types_1.Int || value instanceof types_1.Float) {
        return value.value;
    }
    return 0;
}
function validateArgs(type, mtd) {
    const innerArgs = [...mtd.args];
    // correlate each type arg with args array
    for (const t of type) {
        if (t === 'Obj')
            continue;
        if (t === 'Int') {
            const arg = innerArgs[innerArgs.length - 1];
            if (arg === void 0)
                throw new Error(`not enough arguments for method ${mtd.name}`);
            if (!(arg instanceof types_1.Int && Number.isInteger(arg.value))) {
                throw new Error(`${arg} is not of a required [${t}] type`);
            }
        }
        if (t === 'Real') {
            const arg = innerArgs[innerArgs.length - 1];
            if (arg === void 0)
                throw new Error(`not enough arguments for method ${mtd.name}`);
            if (!(arg instanceof types_1.Float && !Number.isNaN(Number.parseFloat(arg.value.toString())))) {
                throw new Error(`${arg} is not of a required [${t}] type`);
            }
        }
    }
}
function validateType(type, args) {
    for (let i = 0; i < type.length; i++) {
        if (type[i] !== args[i])
            throw new Error(`type [${args[i]}] does not equal to [${type[i]}] type`);
    }
}
function getFromArgs(args, mArg) {
    for (const arg of args) {
        if (arg.name === mArg.ctx)
            return true;
    }
    return false;
}
function attributeExpression(mtd, args) {
    //     let index = 0;
    //     for (let arg of mtd.args) {
    //         if (arg instanceof Parameter) {
    //             arg = evalExprBody(arg);
    //             if (!(arg instanceof ObjectType)) {
    //                 arg = arg[arg._ctx];
    //             }
    //             mtd.args[index] = arg;
    //         }
    //         if (arg instanceof MethodCall) {
    //             // validate context
    //             for (const mArg of arg.args) {
    //                 if (!getFromArgs(args, mArg)) {
    //                     if (mArg instanceof Parameter) {
    //                         // arg.args[index] = evalExprBody(ctx, mArg);
    //                         const res = evalExprBody(mArg);
    //                         arg.args[index] = res[res._ctx];
    //                     }
    //                 }
    //             }
    //         }
    //         index++;
    //     }
    //     return mtd;
}
function attributeBody(body, args) {
    if (body instanceof types_1.Expression) {
        return attributeExpression(body, args);
    }
    return body;
}
function attribution(func) {
    if (func instanceof types_1.Lambda) {
        const args = func.args;
        // func.body = attributeBody(func.body, args);
        // something to do
    }
    return func;
}
function a(method) {
    // console.log(method.body);
    if (method.body instanceof types_1.Parameter) {
        if (!method.body.methodCall) {
            if (method.body.ctx instanceof types_1.ObjectType) {
                return method.body.ctx;
            }
            return dictionary_1.context.get(method.body.ctx).slice(-1).pop();
        }
        else {
            return methodCall(method.body.methodCall);
        }
        // } else if (method.body instanceof Lambda) {
        //     return attribution(method.body);
    }
    return method.body;
}
function evalExprBody(body) {
    if (body instanceof types_1.FieldUpdate) {
        const ctx = dictionary_1.context.get(body.ctx || '_')[dictionary_1.context.get(body.ctx || '_').length - 1];
        if (!(ctx instanceof types_1.ObjectType))
            throw new Error('Object type is required here');
        const method = findMethod(ctx, body.propName);
        if (method) {
            let bd = new types_1.Int(0);
            if (body.value instanceof types_1.Expression) {
                bd = b(evalExpr(body.value));
            }
            validateType([...method.type.args].slice(0, method.type.args.length - 1), method.type.args);
            const field = new types_1.Field(method.name, method.type, bd);
            validateType([method.type.args[method.type.args.length - 1]], [method.type.args[method.type.args.length - 1]]);
            return setMethod(ctx, field);
        }
        else {
            throw new Error('Method not found');
        }
    }
    if (body instanceof types_1.MethodUpdate) {
        const ctx = dictionary_1.context.get(body.ctx || '_')[dictionary_1.context.get(body.ctx || '_').length - 1];
        if (!(ctx instanceof types_1.ObjectType))
            throw new Error('Object type is required here');
        const method = findMethod(ctx, body.propName);
        validateType([...method.type.args].slice(0, method.type.args.length - 1), method.type.args);
        const newMethod = getNewMethod(method, ctx, body);
        validateType([method.type.args[method.type.args.length - 1]], [method.type.args[method.type.args.length - 1]]);
        return setMethod(ctx, newMethod);
    }
    if (body instanceof types_1.Function) {
        // console.log(body);
        if (body.operand instanceof types_1.Add) {
            const res = c(evalParam(body.arg1)) + c(evalParam(body.arg2));
            return body.arg1 instanceof types_1.Float ? new types_1.Float(res) : new types_1.Int(res);
        }
        if (body.operand instanceof types_1.Sub) {
            const res = c(evalParam(body.arg1)) - c(evalParam(body.arg2));
            return body.arg1 instanceof types_1.Float ? new types_1.Float(res) : new types_1.Int(res);
        }
        return new types_1.Int(0);
    }
    if (body instanceof types_1.Parameter) {
        return evalParam(body);
    }
    return methodCall(body);
}
function evalExpr(expr) {
    if (expr.ctx) {
        evalExpr(expr.ctx);
    }
    const ctx = evalExprBodies(expr.args);
    dictionary_1.context.set(dictionary_1.context.get('_default')[dictionary_1.context.get('_default').length - 1], ctx);
    return ctx;
}
function b(body) {
    if (body instanceof types_1.ObjectType) {
        throw new Error('Not implemented!');
    }
    return body;
}
function methodCall(methodCall) {
    const args = [];
    for (const arg of methodCall.args) {
        if (arg instanceof types_1.Lambda) {
            args.push(arg);
        }
        if (arg instanceof types_1.Int || arg instanceof types_1.Float) {
            args.push(arg);
        }
        if (arg instanceof types_1.Expression) {
            args.push(b(evalExpr(arg)));
        }
    }
    const arr = dictionary_1.context.get(dictionary_1.context.get('_default')[dictionary_1.context.get('_default').length - 1] || '_');
    console.log(arr);
    const ctx = arr[arr.length - 1];
    if (!(ctx instanceof types_1.ObjectType))
        throw new Error('Not a context object');
    const methodToExecute = findMethod(ctx, methodCall.name);
    if (methodToExecute) {
        const type = methodToExecute.type.args;
        validateArgs([...type].slice(0, type.length - 1), methodCall);
        if (methodToExecute instanceof types_1.Method) {
            if (typeof methodToExecute.ctx === 'string') {
                dictionary_1.context.set('_default', methodToExecute.ctx);
                dictionary_1.context.set(methodToExecute.ctx, ctx);
            }
            const res = evalBody(methodToExecute.body, args);
            const outputType = type[type.length - 1];
            validateArgs([outputType], { ...methodToExecute, args: [res] });
            dictionary_1.context.remove(methodToExecute.ctx);
            return res;
        }
        else {
            const res = evalBody(methodToExecute.body, args);
            const outputType = type[type.length - 1];
            validateArgs([outputType], { ...methodToExecute, args: [res] });
            return res;
        }
    }
    else {
        throw new Error('Method not found');
    }
}
function evalSigma(object, parentCall) {
    if (object instanceof types_1.ObjectType) {
        dictionary_1.context.set('_', object);
    }
    else {
        const ctx = evalSigma(object.objectType, object.call);
        dictionary_1.context.set(dictionary_1.context.get('_default')[dictionary_1.context.get('_default').length - 1] || '_', ctx);
    }
    return resultOfCall(parentCall);
}
function resultOfCall(call) {
    if (call instanceof types_1.Call) {
        return methodCall(call);
    }
    return evalExprBody(call);
}
function evalMain(sigma) {
    const ctx = evalSigma(sigma.objectType, sigma.call);
    dictionary_1.context.set('_', ctx);
    const result = resultOfCall(sigma.call);
    return result.toString();
}
void function () {
    /*console.log(evalMain(sigma));*/
    console.log(evalMain(objects_1.sigma2));
}();
//# sourceMappingURL=index.js.map