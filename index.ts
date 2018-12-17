import {
    sigma,
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
 } from './types';
import { context } from './dictionary';



function findMethod(object: ObjectType, name: string): Method|Field {
    for (const method of object.props) {
        if (method.name === name) return method;
    }
}

function evalMethod() {

}

function evalParam(param: Parameter): number {

}

function evalExprBody(body: ExprBody): ReturnValue {
    if (body instanceof FieldUpdate) {
        const ctx = context.get(body.ctx);

    }
    if (body instanceof MethodUpdate) {

    }
    if (body instanceof Function) {
       if (body.operand instanceof Add) {
           return evalParam(body.arg1) + evalParam(body.arg2);
       }
    }
    if (body instanceof Parameter) {

    }
    if (body instanceof Call) {

    }
}

function evalExpr(expr: Expression) {
    const ctx = expr.args
        .reduce((p: ReturnValue, c: ExprBody) => {
            return evalExprBody(c);
        }, 0);
}

function methodCall(methodCall: Call) {
    const args = [];
    for (const arg of methodCall.args) {
        if (arg instanceof Lambda) {

        }
        if (arg instanceof Int || arg instanceof Float || arg instanceof String) {
            args.push(arg);
        }
        if (arg instanceof Expression) {
            args.push(evalExpr(arg));
        }
    }
    const ctx = context.get(methodCall.ctx);
    const methodToExecute = findMethod(ctx, methodCall.name);
    if (methodToExecute instanceof Method) {
        return evalMethod(methodToExecute.body);
    }
    if (methodToExecute instanceof Field) {

    }
}

function methodUpdate(methodUpdate: MethodUpdate) {

}

function fieldUpdate(fieldUpdate: FieldUpdate) {

}

function evalSigma(object: Sigma | ObjectType): ReturnValue {
    if (object instanceof Sigma) {
        const ctx = evalSigma(object.objectType);
        context.set('_', ctx);
        if (object.call instanceof Call) {
            return methodCall(object.call);
        }
        if (object.call instanceof MethodUpdate) {
            return fieldUpdate(object.call);
        }
        if (object.call instanceof FieldUpdate) {
            
        }
    } else {

    }
}

function resultOfCall(call: CutExpr): ReturnValue {
    if (call instanceof Call) {
        return methodCall(call);
    }
    if (call instanceof MethodUpdate) {
        return methodUpdate(call);
    }
    if (call instanceof FieldUpdate) {
        return fieldUpdate(call);
    }    
}

function evalMain(sigma: Sigma): string {
    const ctx =  evalSigma(sigma.objectType);
    context.set('_', ctx);
    const result = resultOfCall(sigma.call);
    return result.toString();
}

void function() {
    console.log(sigma);
    // console.log(evalMain(sigma));
}();