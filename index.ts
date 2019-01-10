import { Map } from "immutable";
import {
    sigma, sigma2,
} from './objects';
import {
    Sigma,
    ObjectType,
    Call,
    Lambda,
    MethodUpdate,
    FieldUpdate,
    Int,
    Float,
    Expression,
    CutExpr,
    Method,
    ReturnValue,
    Field,
    ExprBody,
    Function,
    Parameter,
    Add,
    Value,
    Argument, Type, lazy, Body, LambdaArg, Sub,
} from './types';

function findMethod(object: ObjectType, name: string): Method | Field | undefined {
    for (const method of object.props) {
        if (method.name === name) return method;
    }
}

function setMethod(ctx: ObjectType, name: Field | Method): ObjectType {
    const res = new ObjectType([]);
    for (let i = 0; i < ctx.props.length; i++) {
        if (ctx.props[i].name === name.name) {
            res.props.push(name);
        } else {
            res.props.push(ctx.props[i]);
        }
    }
    return res;
}

function evalLambda(context: Map<string, any>, body: Lambda, args?: Argument[]): ReturnValue {
    body.args.forEach((arg, i) => {
        if (args && args[i]) {
            context = context.set(arg.name, args[i]);
        }
    });
    return evalExpr(context, body.body);
}

function evalBody(context: Map<string, any>, body: Value, args?: Argument[]): ReturnValue {
    if (body instanceof Lambda) {
        return evalLambda(context, body, args);
    }
    if (body instanceof Expression) {
        return evalExpr(context, body);
    }
    if (body instanceof ObjectType) {
        return body;
    }
    return body;
}

function evalParam(context: Map<string, any>, param: Parameter): ReturnValue {
    if (param.methodCall) {
        return methodCall(context, param.methodCall);
    }
    if (typeof param === 'string') {
        const res = context.get(param)[context.get(param).length - 1];
        if (res instanceof ObjectType) {
            return res;
        }
        if (res instanceof Int || res instanceof Float) {
            return res;
        }
        throw new Error('Not a valid type');
    } else {
        if (param instanceof ObjectType) {
            return param;
        }
        if (param instanceof Int || param instanceof Float) {
            return param;
        }
        return context.get(param.ctx as string);
    }
}

function evalExprBodies(context: Map<string, any>, body: ExprBody[]): ReturnValue {
    let res: ReturnValue = new Int(0);
    // console.log(body);
    body.forEach(b => {
        res = evalExprBody(context, b);
    });
    return res;
}

function getNewMethod(context: Map<string, any>, method: Method, ctx: ObjectType, mupdate: MethodUpdate): Method {
    // console.log(body);
    const bodyB = lazy(() => a(context, mupdate));
    const bodyC = typeof method.ctx === 'string' ? bodyB() : bodyB;

    if (method.body instanceof Expression) {
        const body = evalExprBodies(context, method.body.args);
        if (body instanceof ObjectType) {
            return new Method(method.name, method.type, method.ctx, bodyC);
        // } else {
        //     throw new Error('ObjectType expected');
        }

    } else if (method.body instanceof Lambda) {
        return new Method(method.name, method.type, ctx, bodyC)
    }
    return method;
}

function c(value: ReturnValue): number {
    if (value instanceof Int || value instanceof Float) {
        return value.value;
    }
    return 0;
}

function validateArgs(type: Array<string|Type>, mtd: Call) {
    const innerArgs = [...mtd.args];
    // correlate each type arg with args array
    for (const t of type) {
        if (t === 'Obj') continue;
        if (t === 'Int') {
            const arg = innerArgs[innerArgs.length - 1];
            if (arg === void 0) throw new Error(`not enough arguments for method ${mtd.name}`);
            if (!(arg instanceof Int && Number.isInteger(arg.value))) {
                throw new Error(`${arg} is not of a required [${t}] type`);
            }
        }
        if (t === 'Real') {
            const arg = innerArgs[innerArgs.length - 1];
            if (arg === void 0) throw new Error(`not enough arguments for method ${mtd.name}`);
            if (!(arg instanceof Float && !Number.isNaN(Number.parseFloat(arg.value.toString())))) {
                throw new Error(`${arg} is not of a required [${t}] type`);
            }
        }
    }
}

function validateType(type: Array<string|Type>, args: Array<string|Type>) {
    for (let i = 0; i < type.length; i++) {
        if (type[i] !== args[i]) throw new Error(`type [${args[i]}] does not equal to [${type[i]}] type`);
    }
}

function getFromArgs(args: LambdaArg[], mArg: Parameter) {
    for (const arg of args) {
        if (arg.name === mArg.ctx) return true;
    }
    return false;
}

function attributeExpression(mtd: Expression, args: LambdaArg[]) {
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

function attributeBody(body: Expression, args: LambdaArg[]) {
    if (body instanceof Expression) {
        return attributeExpression(body, args);
    }
    return body;
}

function attribution(func: Body) {
    if (func instanceof Lambda) {
        const args = func.args;
        // func.body = attributeBody(func.body, args);
        // something to do
    }
    return func;
}

function a(context: Map<string, any>, method: MethodUpdate): ReturnValue|Lambda|Body {
    // console.log(method.body);
    if (method.body instanceof Parameter) {
        if (!method.body.methodCall) {
            if (method.body.ctx instanceof ObjectType) {
                return method.body.ctx;
            }
            return <ObjectType> context.get(<string> method.body.ctx);
        } else {
            return methodCall(context, method.body.methodCall);
        }
    // } else if (method.body instanceof Lambda) {
    //     return attribution(method.body);
    }
    return method.body;
}

function evalExprBody(context: Map<string, any>, body: ExprBody): ReturnValue {
    if (body instanceof FieldUpdate) {
        const ctx = context.get(body.ctx || '_')[context.get(body.ctx || '_').length - 1];
        if (!(ctx instanceof ObjectType)) throw new Error('Object type is required here');
        const method = findMethod(ctx, body.propName);
        if (method) {
            let bd = new Int(0);
            if (body.value instanceof Expression) {
                bd = b(evalExpr(context, body.value));
            }
            validateType([...method.type.args].slice(0, method.type.args.length - 1), method.type.args);
            const field = new Field(method.name, method.type, bd);
            validateType([method.type.args[method.type.args.length - 1]], [method.type.args[method.type.args.length - 1]]);
            return setMethod(ctx, field);
        } else {
            throw new Error('Method not found');
        }
    }
    if (body instanceof MethodUpdate) {
        const ctx = context.get(body.ctx || '_')[context.get(body.ctx || '_').length - 1];
        if (!(ctx instanceof ObjectType)) throw new Error('Object type is required here');
        const method: Method = findMethod(ctx, body.propName) as Method;
        validateType([...method.type.args].slice(0, method.type.args.length - 1), method.type.args);
        const newMethod = getNewMethod(context, method, ctx, body);
        validateType([method.type.args[method.type.args.length - 1]], [method.type.args[method.type.args.length - 1]]);
        return setMethod(ctx, newMethod);
    }
    if (body instanceof Function) {
        // console.log(body);
        if (body.operand instanceof Add) {
            const res = c(evalParam(context, body.arg1)) + c(evalParam(context, body.arg2));
            return body.arg1 instanceof Float ? new Float(res) : new Int(res);
        }
        if (body.operand instanceof Sub) {
            const res = c(evalParam(context, body.arg1)) - c(evalParam(context, body.arg2));
            return body.arg1 instanceof Float ? new Float(res) : new Int(res);
        }
        return new Int(0);
    }
    if (body instanceof Parameter) {
        return evalParam(context, body);
    }
    return methodCall(context, body)
}

function evalExpr(context: Map<string, any>, expr: Expression): ReturnValue {
    if (expr.ctx) {
        evalExpr(context, expr.ctx);
    }
    const ctx = evalExprBodies(context, expr.args);
    context = context.set(context.get('_default'), ctx);
    return ctx;
}

function b(body: ReturnValue) {
    if (body instanceof ObjectType) {
        throw new Error('Not implemented!');
    }
    return body;
}

function methodCall(context: Map<string, any>, methodCall: Call): ReturnValue {
    const args: Argument[] = [];
    for (const arg of methodCall.args) {
        if (arg instanceof Lambda) {
            args.push(arg);
        }
        if (arg instanceof Int || arg instanceof Float) {
            args.push(arg);
        }
        if (arg instanceof Expression) {
            args.push(b(evalExpr(context, arg)));
        }
    }
    const arr = context.get(context.get('_default'));
    console.log(arr);
    const ctx = arr;
    if (!(ctx instanceof ObjectType)) throw new Error('Not a context object');
    const methodToExecute = findMethod(ctx, methodCall.name);
    if (methodToExecute) {
        const type = methodToExecute.type.args;
        validateArgs([...type].slice(0, type.length - 1), methodCall);
        if (methodToExecute instanceof Method) {
            if (typeof methodToExecute.ctx === 'string') {
                context = context.set('_default', methodToExecute.ctx);
                context = context.set(methodToExecute.ctx, ctx);
            }
            const res = evalBody(context, methodToExecute.body, args);
            const outputType = type[type.length - 1];
            validateArgs([outputType], { ...methodToExecute, args: [res] } as any as Call);
            context = context.remove(methodToExecute.ctx as string);
            return res;
        } else {
            const res = evalBody(context, methodToExecute.body, args);
            const outputType = type[type.length - 1];
            validateArgs([outputType], { ...methodToExecute, args: [res] } as any as Call);
            return res;
        }
    } else {
        throw new Error('Method not found');
    }
}

function evalSigma(context: Map<string, any>, object: Sigma | ObjectType, parentCall: CutExpr): ReturnValue {
    let map = Map<string, any>();
    if (object instanceof ObjectType) {
        map = map.set('_', object);
    } else {
        const ctx = evalSigma(map, object.objectType, object.call);
        map = map.set(context.get('_default'), ctx);
    }
    return resultOfCall(map, parentCall);
}

function resultOfCall(ctx: Map<string, any>, call: CutExpr): ReturnValue {
    if (call instanceof Call) {
        return methodCall(ctx, call);
    }
    return evalExprBody(ctx, call);
}

function evalMain(sigma: Sigma): string {
    let a = Map<string, any>();
    const ctx = evalSigma(a, sigma.objectType, sigma.call);
    a = a.set('_', ctx);
    const result = resultOfCall(a, sigma.call);
    return result.toString();
}

void function () {
    /*console.log(evalMain(sigma));*/
    console.log(evalMain(sigma2));
}();