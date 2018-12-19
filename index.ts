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
  Value,
  Argument,
} from './types';
import { context, ContextType } from './dictionary';


function findMethod(object: ObjectType, name: string): Method|Field|undefined {
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

function evalLambda(body: Lambda, args?: Argument[]): ReturnValue {
    body.args.forEach((arg, i) => {
        if (args && args[i]) {
            context.set(arg.name, args[i]);
        }
    });
  return evalExpr(body.body);
}

function evalBody(body: Value, args?: Argument[]): ReturnValue {
    if (body instanceof Lambda) {
        return evalLambda(body, args);
    }
    if (body instanceof Expression) {
        return evalExpr(body);
    }
    if (body instanceof ObjectType) {
        return body;
    }
    return body.value;
}

function evalParam(param: Parameter): ReturnValue {
    if (param.methodCall) {
        return methodCall(param.methodCall);
    }
    if (typeof param === 'string') {
        const res = context.get(param).pop();
        if (res instanceof ObjectType) {
            return res;
        }
        if (res instanceof Int || res instanceof Float) {
            return res.value;
        }
        throw new Error('Not a valid type');
    } else {
      if (param instanceof ObjectType) {
        return param; 
      }
      if (param instanceof Int || param instanceof Float) {
        return param.value;
      }
      return context.get(param.ctx as string).pop() as ReturnValue;
    }
}

function evalExprBodies(body: ExprBody[]): ReturnValue {
    let res: ReturnValue = 0;
    body.forEach(b => {
        res = evalExprBody(b);
    });
    return res;
}

function getNewMethod(method: Method, ctx: ObjectType): Method {
  if (method.body instanceof Expression) {
      const body = evalExprBodies(method.body.args);
      if (body instanceof ObjectType) {
        return new Method(method.name, method.type, method.ctx, body);
      } else {
          throw new Error('ObjectType expected');
      }
  } else if (method.body instanceof Lambda) {
      return new Method(method.name, method.type, ctx, method.body)
  }
  return method;
}

function c(value: ReturnValue): number {
    if (value instanceof Int || value instanceof Float) {
        return value.value;
    }
    if (typeof value === 'number') {
        return value;
    }
    return 0;
}

function evalExprBody(body: ExprBody): ReturnValue {
    if (body instanceof FieldUpdate) {
        const ctx = context.get(body.ctx || '_').pop();
        if (!(ctx instanceof ObjectType)) throw new Error('Object type is required here');
        const method = findMethod(ctx, body.propName);
        if (method) {
          let bd = new Int(0);
          if (body.value instanceof Expression) {
              bd = b(evalExpr(body.value));
          }
          const field = new Field(method.name, method.type, bd);
          return setMethod(ctx, field);
        } else {
            throw new Error('Method not found');
        }
    }
    if (body instanceof MethodUpdate) {
      const ctx = context.get(body.ctx || '_').pop();
      if (!(ctx instanceof ObjectType)) throw new Error('Object type is required here');
      const method: Method = findMethod(ctx, body.propName) as Method;
      const newMethod = getNewMethod(method, ctx);
      return setMethod(ctx, newMethod);
    }
    if (body instanceof Function) {
       if (body.operand instanceof Add) {
           return c(evalParam(body.arg1)) + c(evalParam(body.arg2));
       }
       return 0;
    }
    if (body instanceof Parameter) {
        return evalParam(body);
    }
    return methodCall(body)
}

function evalExpr(expr: Expression): ReturnValue {
    const ctx = evalExprBodies(expr.args);
    context.set(context.get('_default').pop() as string, ctx);
    if (expr.ctx) {
        return evalExpr(expr.ctx);
    }
    return ctx;
}

function b(body: ReturnValue) {
  if (typeof body === 'number') {
      if (parseInt(body.toString()) === body) {
          return new Int(body);
      } else {
          return new Float(body);
      }
  }
  if (body instanceof ObjectType) {
      throw new Error('Not implemented!');
  }
  return body;
}

function methodCall(methodCall: Call): ReturnValue {
    const args: Argument[] = [];
    for (const arg of methodCall.args) {
        if (arg instanceof Lambda) {
            args.push(arg);
        }
        if (arg instanceof Int || arg instanceof Float) {
            args.push(arg);
        }
        if (arg instanceof Expression) {
            args.push(b(evalExpr(arg)));
        }
    }
    const ctx = context.get(context.get('_default').pop() as string || '_').pop();
    if (!(ctx instanceof ObjectType)) throw new Error('Not a context object');
    const methodToExecute = findMethod(ctx, methodCall.name);
    if (methodToExecute) {
      if (methodToExecute instanceof Method) {
          if (typeof methodToExecute.ctx === 'string') {
              context.set('_default', methodToExecute.ctx);
            context.set(methodToExecute.ctx, ctx);
          }
        return evalBody(methodToExecute.body, args);
      }
      return evalBody(methodToExecute.body);
    } else {
        throw new Error('Method not found');
    }
}

function evalSigma(object: Sigma | ObjectType, parentCall: CutExpr): ReturnValue {
    if (object instanceof ObjectType) {
        context.set('_', object);
    } else {
        const ctx = evalSigma(object.objectType, object.call);
        context.set(context.get('_default').pop() as string || '_', ctx);
    }
    return resultOfCall(parentCall);
}

function resultOfCall(call: CutExpr): ReturnValue {
    if (call instanceof Call) {
        return methodCall(call);
    }
    return evalExprBody(call);
}

function evalMain(sigma: Sigma): string {
    const ctx =  evalSigma(sigma.objectType, sigma.call);
    context.set('_', ctx);
    const result = resultOfCall(sigma.call);
    return result.toString();
}

void function() {
    console.log(sigma);
    console.log(evalMain(sigma));
}();