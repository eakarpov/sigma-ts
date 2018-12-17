type Optional<T> = T | null;

export type CutExpr = Call | MethodUpdate | FieldUpdate;
export type ExprBody = FieldUpdate | MethodUpdate | Function | Parameter | Call;
export type InputValue = Int | Float;
type Body = Lambda | ObjectType | Expression;
type Value = Body | InputValue;
type ParameterValue = InputValue | string;
type Argument = Lambda | InputValue | Expression;
type Operation = Add | Substring | Multiply | Divide;

export class Add {}
export class Substring {}
export class Multiply {}
export class Divide {}

export type ReturnValue = number|string|ObjectType;

export class Parameter {
  constructor(public ctx: ParameterValue, public methodCall: Optional<Call>) {
  }
}

export class Function {
  constructor(public arg1: Parameter, public operand: Operation, public arg2: Parameter) {
  }
}

export class Type {
  constructor(public args: Array<Type | string>) {}
}

export class LambdaArg {
  constructor(public name: string, public type: Type) {
  }
}

export class Lambda {
  constructor(public args: LambdaArg[], public body: Expression) {
  }
}

export class Field {
  constructor(public name: string, public type: Type, public body: Value) {
  }
}

export class Method {
  constructor(public name: string, public type: Type, public ctx: string, public body: Body) {
  }
}

export class FieldUpdate {
  constructor(public ctx: Optional<string>, public propName: string, public type: Type, public value: Value) {
  }
}

export class MethodUpdate {
  constructor(public ctx: Optional<string>, public propName: string, public type: Type, public newCtx: string, public body: Body) {
  }
}

export class Call {
  constructor(public ctx: Optional<string>, public name: string, public args: Optional<Argument[]> = []) {
  }
}

export class ObjectType {
  constructor(public props: Array<Field | Method>) {
  }
}

export class Sigma {
  constructor(public objectType: ObjectType | Sigma, public call: CutExpr) {
  }
}

export class Expression {
  constructor(public ctx: Optional<Expression>, public args: ExprBody[]) {
  }
}

export class Int {
  constructor(public value: number) {
  }
}

export class Float {
  constructor(public value: number) {
  }
}

export const lazy = function (creator) {
  let res;
  let processed = false;
  return function () {
    if (processed) return res;
    res = creator.apply(this, arguments);
    processed = true;
    return res;
  };
};