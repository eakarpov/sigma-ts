type Optional<T> = T | null;

export type CutExpr = Call | MethodUpdate | FieldUpdate;
export type ExprBody = FieldUpdate | MethodUpdate | Function | Parameter | Call;
export type InputValue = Int | Float;
export type Body = Lambda | ObjectType | Expression;
export type Value = Body | InputValue;
export type ParameterValue = InputValue | string;
export type Argument = Lambda | InputValue | Expression;
export type Operation = Add | Substring | Multiply | Divide;

export class Add {}
export class Substring {}
export class Multiply {}
export class Divide {}

export type ReturnValue = Int|Float|ObjectType;

export class Parameter {
  constructor(public ctx: ParameterValue, public methodCall?: Call) {
  }
}

export class Closure<T> {
  constructor(public data: T, public env: Value[]) {}
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
  constructor(public name: string, public type: Type, public ctx: string|ObjectType, public body: Body) {
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
  constructor(public ctx: Optional<string>, public name: string, public args: Argument[] = []) {
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
  constructor(public ctx: Optional<Expression>, public args: Array<ExprBody>) {
  }
}

export class Int {
  constructor(public value: number) {
  }

  public toString() {
    return this.value.toString();
  }
}

export class Float {
  constructor(public value: number) {
  }
  public toString() {
      return this.value.toString();
  }
}

export const lazy = function (creator: any) {
  let res: any;
  let processed = false;
  return function (this: any) {
    if (processed) return res;
    res = creator.apply(this, arguments);
    processed = true;
    return res;
  };
};