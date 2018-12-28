"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
exports.sigma = new types_1.Sigma(new types_1.Sigma(new types_1.Sigma(new types_1.Sigma(new types_1.Sigma(new types_1.ObjectType([
    new types_1.Field('x', new types_1.Type(['Int']), new types_1.Int(0)),
    new types_1.Method('move', new types_1.Type(['Int', 'Obj']), 'this', new types_1.Lambda([new types_1.LambdaArg('dx', new types_1.Type(['Int']))], new types_1.Expression(null, [new types_1.FieldUpdate('this', 'x', new types_1.Type(['Int']), new types_1.Expression(null, [new types_1.Function(new types_1.Parameter('this', new types_1.Call(null, 'x')), new types_1.Add(), new types_1.Parameter('dx'))]))])))
]), new types_1.Call(null, 'move', [new types_1.Int(5)])), new types_1.Call(null, 'move', [new types_1.Int(6)])), new types_1.Call(null, 'move', [new types_1.Int(-4)])), new types_1.Call(null, "move", [new types_1.Int(-13)])), new types_1.Call(null, 'x'));
exports.sigma2 = new types_1.Sigma(new types_1.Sigma(new types_1.Sigma(new types_1.Sigma(new types_1.Sigma(new types_1.Sigma(new types_1.ObjectType([
    new types_1.Field("arg", new types_1.Type(['Real']), new types_1.Float(0.0)),
    new types_1.Field('acc', new types_1.Type(['Real']), new types_1.Float(0.0)),
    new types_1.Method('clear', new types_1.Type(['Obj']), 'this', new types_1.Expression(new types_1.Expression(new types_1.Expression(null, [new types_1.FieldUpdate('this', 'arg', new types_1.Type(['Real']), new types_1.Float(0.0))]), [new types_1.FieldUpdate(null, 'acc', new types_1.Type(['Real']), new types_1.Float(0.0))]), [new types_1.MethodUpdate(null, 'equals', new types_1.Type(['Real']), 'self', new types_1.Expression(null, [new types_1.Call('self', 'arg')]))])),
    new types_1.Method('enter', new types_1.Type(['Real', 'Obj']), 'this', new types_1.Lambda([new types_1.LambdaArg('n', new types_1.Type(['Real']))], new types_1.Expression(null, [new types_1.FieldUpdate('this', 'arg', new types_1.Type(['Real']), new types_1.Expression(null, [new types_1.Parameter('n')]))]))),
    new types_1.Method('add', new types_1.Type(['Obj']), 'this', new types_1.Expression(new types_1.Expression(null, [new types_1.FieldUpdate('this', 'acc', new types_1.Type(['Real']), new types_1.Expression(null, [new types_1.Call('this', 'equals')]))]), [new types_1.MethodUpdate(null, 'equals', new types_1.Type(['Real']), 'self', new types_1.Expression(null, [new types_1.Function(new types_1.Parameter('self', new types_1.Call(null, 'acc')), new types_1.Add(), new types_1.Parameter('self', new types_1.Call(null, 'arg')))]))])),
    new types_1.Method('sub', new types_1.Type(['Obj']), 'this', new types_1.Expression(new types_1.Expression(null, [new types_1.FieldUpdate('this', 'acc', new types_1.Type(['Real']), new types_1.Expression(null, [new types_1.Call('this', 'equals')]))]), [new types_1.MethodUpdate(null, 'equals', new types_1.Type(['Real']), 'self', new types_1.Expression(null, [new types_1.Function(new types_1.Parameter('self', new types_1.Call(null, 'acc')), new types_1.Sub(), new types_1.Parameter('self', new types_1.Call(null, 'arg')))]))])),
    new types_1.Method('equals', new types_1.Type(['Real']), 'this', new types_1.Expression(null, [new types_1.Call('this', 'arg')]))
]), new types_1.Call(null, 'enter', [new types_1.Float(5.1)])), new types_1.Call(null, 'add')), new types_1.Call(null, 'enter', [new types_1.Float(3.2)])), new types_1.Call(null, 'sub')), new types_1.Call(null, 'enter', [new types_1.Float(-2.2)])), new types_1.Call(null, 'equals'));
exports.sigma3 = new types_1.Sigma(new types_1.Sigma(new types_1.Sigma(new types_1.Sigma(new types_1.Sigma(new types_1.Sigma(new types_1.Sigma(new types_1.ObjectType([
    new types_1.Method('retrieve', new types_1.Type(['Obj']), 's', new types_1.Expression(null, [new types_1.Parameter('s')])),
    new types_1.Method('backup', new types_1.Type(['Obj']), 'b', new types_1.Expression(null, [new types_1.MethodUpdate('b', 'retrieve', new types_1.Type(['Obj']), 's', new types_1.Expression(null, [new types_1.Parameter('b')]))
    ])),
    new types_1.Field('value', new types_1.Type(['Int']), new types_1.Int(10)),
]), new types_1.Call(null, 'backup')), new types_1.FieldUpdate(null, 'value', new types_1.Type(['Int']), new types_1.Int(15))), new types_1.Call(null, 'backup')), new types_1.FieldUpdate(null, 'value', new types_1.Type(['Int']), new types_1.Int(25))), new types_1.Call(null, 'retrieve')), new types_1.Call(null, 'retrieve')), new types_1.Call(null, 'value'));
/*  const sigma4 = new Sigma(
    new ObjectType([
        new Method('zero', new Type('Obj'), 'global', new ObjectType(
            new Method('succ', new Type('Obj'), 'this', new Expression(
                new Expression(
                    new Expression(
                        null,
                        new FieldUpdate('this', 'ifzero', new Type('Obj'), new Expression(
                            null,
                            new Call('global','false'),
                        ))
                    ),
                    new FieldUpdate(null, 'pred', new Type('Obj'), new Expression(null,
                        new Parameter('this')
                    ))
                ),
                new FieldUpdate(null, 'num', new Type('Int'), new Expression(null,
                    new Function(new Parameter('this', new Call(null, 'num')), '+', new Parameter(new Int(1)))
                ))
            )),
            new Field('ifzero', new Type('Obj'), new Expression(
                null, new Call('global', 'true')
            )),
            new Field('num', new Type('Int'), new Int(0))
        )),
        new Method('true', new Type('Obj'), 'global', new ObjectType([
            new Method('then', new Type('Obj'), 'this', new Expression(null, new Parameter('this'))),
            new Method('val', new Type('Obj'), 'this', new Expression(
                null,
                new Call('this', 'then')
            ))
        ])),
        new Method('false', new Type('Obj'), 'global', new ObjectType([
            new Method('else', new Type('Obj'), 'this', new Expression(null, new Parameter('this'))),
            new Method('val', new Type('Obj'), 'this', new Expression(
                null,
                new Call('this', 'else')
            ))
        ])),
        new Method('prog', new Type('Int'), 'global', new Expression(
            new Expression(
                new Expression(
                    new Expression(
                        new Expression(null, new Call('global', 'zero')),
            new Call(null, 'succ')),
            new Call(null, 'succ')),
            new Call(null, 'pred')),
            new Call(null, 'num'))
        )
    ]), new Expression(null, new Call(null, 'prog'))
  );*/
exports.sigma4 = new types_1.Sigma(new types_1.ObjectType([
    new types_1.Method('zero', new types_1.Type(['Obj']), 'global', new types_1.ObjectType([
        new types_1.Method('succ', new types_1.Type(['Obj']), 'this', new types_1.Expression(new types_1.Expression(new types_1.Expression(null, [
            new types_1.FieldUpdate('this', 'ifzero', new types_1.Type(['Obj']), new types_1.Expression(null, [
                new types_1.Call('global', 'false')
            ]))
        ]), [
            new types_1.FieldUpdate(null, 'pred', new types_1.Type(['Obj']), new types_1.Expression(null, [new types_1.Parameter('this')]))
        ]), [
            new types_1.FieldUpdate(null, 'num', new types_1.Type(['Int']), new types_1.Expression(null, [
                new types_1.Function(new types_1.Parameter('this', new types_1.Call(null, 'num')), '+', new types_1.Parameter(new types_1.Int(1)))
            ]))
        ])),
        new types_1.Field('ifzero', new types_1.Type(['Obj']), new types_1.Expression(null, [
            new types_1.Call('global', 'true')
        ])),
        new types_1.Field('num', new types_1.Type(['Int']), new types_1.Expression(null, [
            new types_1.Parameter(new types_1.Int(0))
        ])),
    ])),
    new types_1.Method('true', new types_1.Type(['Obj']), 'global', new types_1.ObjectType([
        new types_1.Method('then', new types_1.Type(['Obj']), 'this', new types_1.Expression(null, [
            new types_1.Parameter('this')
        ])),
        new types_1.Method('val', new types_1.Type(['Obj']), 'this', new types_1.Expression(null, [
            new types_1.Call('this', 'then')
        ]))
    ])),
    new types_1.Method('false', new types_1.Type(['Obj']), 'global', new types_1.ObjectType([
        new types_1.Method('else', new types_1.Type(['Obj']), 'this', new types_1.Expression(null, [
            new types_1.Parameter('this')
        ])),
        new types_1.Method('val', new types_1.Type(['Obj']), 'this', new types_1.Expression(null, [
            new types_1.Call('this', 'else')
        ]))
    ])),
    new types_1.Method('prog', new types_1.Type(['Int']), 'global', new types_1.Expression(null, [
        new types_1.Call('global', 'zero'),
        new types_1.Call(null, 'succ'),
        new types_1.Call(null, 'succ'),
        new types_1.Call(null, 'succ'),
        new types_1.Call(null, 'succ'),
        new types_1.Call(null, 'pred'),
        new types_1.Call(null, 'num')
    ]))
]), new types_1.Call(null, 'prog'));
/*export const sigma5 = new Sigma(new ObjectType([
  new Method('numeral', new Type(['Obj']), 'top', new ObjectType([
    new Method('zero', new Type(['Obj']), 'numeral', new ObjectType([
      new Method('case', new Type(['Obj', 'Obj', 'Obj']), 'this',
        new Lambda([new LambdaArg('z', new Type('Obj')), new LambdaArg('s', new Type(['Obj']))],
          new Expression(null, [new Parameter('z', null)]))),
      new Method('succ', new Type('Obj'), 'this', new Expression(new Expression(null, [
        new MethodUpdate('this', 'case', new Type(['Obj', 'Obj', 'Obj']), 'tt',
          new Lambda([new LambdaArg('z', new Type(['Obj'])), new LambdaArg('s', new Type(['Obj']))],
            new Expression(null, [
              new Call('s', null, [new Parameter('this', null)])
            ])))
      ]), [
        new FieldUpdate(null, 'val', new Type(['Int']), new Expression(null, [
          new Function(new Parameter('this', new Call(null, 'val')), '+', new Parameter(new Int(1), null))
        ]))
      ])),
      new Field('val', new Type(['Int']), new Expression(null, [
        new Parameter(new Int(0), null)
      ])),
      new Method('pred', new Type(['Obj']), 'this', new Expression(null, [
        new Call('this', 'case', [
          new Parameter('numeral', new Call(null, 'zero')),
          new Lambda([new LambdaArg('x', new Type(['Obj', 'Obj']))], new Expression(null, [
            new Parameter('x', null)
          ]))
        ])
      ])),
      new Method('add', new Type(['Obj', 'Int']), 'this', new Lambda([
        new LambdaArg('that', new Type(['Obj']))
      ], new Expression(null, [
        new Call('this', 'case', [
          new Parameter('that', null),
          new Lambda([new LambdaArg('x', new Type(['Obj']))], new Expression(null, [
            new Call('x', 'add', [
              new Parameter('that', new Call(null, 'succ'))
            ])
          ]))
        ])
      ])))
    ])),
    new Method('fib', new Type('Obj'), 'numeral', new Lambda([new LambdaArg('n', new Type(['Obj']))], new Expression(null, [
      new Call('n', 'case', [
        new Parameter('numeral', new Call(null, 'zero')),
        new Lambda([new LambdaArg('x', new Type(['Obj']))],
          new Expression(null, [
            new Call('x', 'case', [
              new Parameter('n', null),
              new Lambda([new LambdaArg('y', new Type(['Obj']))],
                new Expression(new Expression(null, [
                  new Call('numeral', 'fib', [new Parameter('x')]),
                ]), [
                  new Call(null, 'add', [
                    new Parameter('numeral', new Call(null, 'fib', [new Parameter('y')]))
                  ])
                ]))
            ])
          ]))
      ])
    ]))),
  ])),
  new Method('main', new Type('Int'), 'top',
    new Expression(
      new Expression(null, [
        new Call('top', 'numeral')
      ]), [
        new Call(null, 'fib', [
          new Parameter('top', [
            new Call(null, 'numeral'),
            new Call(null, 'zero'),
            new Call(null, 'succ'),
            new Call(null, 'succ'),
            // new Call(null, 'succ'),
            // new Call(null, 'succ'),
            // new Call(null, 'succ'),
            // new Call(null, 'succ'),
            // new Call(null, 'succ'),
            // new Call(null, 'succ'),
            // new Call(null, 'succ'),
            // new Call(null, 'succ'),
            // new Call(null, 'succ'),
            // new Call(null, 'succ'),
            // new Call(null, 'succ'),
            // new Call(null, 'succ'),
            // new Call(null, 'succ'),
          ])
        ]),
        new Call(null, 'val')
      ]))
]), new Call(null, 'main'));*/
// [
//     numeral: Obj = @top => [
//         zero: Obj = @numeral => [case: Obj -> Obj -> Obj = @zero => \(z: Obj) => \(s: Obj) => z, succ: Obj = @zero => (zero.case: Obj -> Obj -> Obj <= @tt => \(z: Obj) => \(s: Obj) => s.zero).val: Int := zero.val + 1, val: Int := 0, pred: Obj = @this => this.case(numeral.zero)(\(x: Obj -> Obj) => x), add: Obj -> Int = @this => \(that: Obj) => this.case(that)(\(x: Obj) => x.add(that.succ))],
//         fib: Obj = @ numeral => \(n: Obj) => n.case(numeral.zero)(\(x: Obj) => x.case(n)(\(y: Obj) => (numeral.fib(x)).add(numeral.fib(y))))
//     ],
//     main: Int = @ top => (top.numeral.fib(top.numeral.zero.succ.succ.succ.succ.succ.succ.succ.succ.succ.succ.succ.succ.succ.succ.succ)).val
// ].main
//# sourceMappingURL=objects.js.map