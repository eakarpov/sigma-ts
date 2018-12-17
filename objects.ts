import {
    Call,
    Expression,
    Field,
    FieldUpdate,
    Float,
    Function,
    Int,
    Lambda,
    LambdaArg,
    Method,
    MethodUpdate,
    ObjectType,
    Parameter,
    Sigma,
    Type
  } from './types';
  
  export const sigma = new Sigma(
    new Sigma(
      new Sigma(
        new Sigma(
          new Sigma(
            new ObjectType([
              new Field('x', new Type(['Int']), new Int(0)),
              new Method(
                'move',
                new Type(['Int', 'Obj']),
                'this',
                new Lambda(
                  [new LambdaArg('dx', new Type(['Int']))],
                  new Expression(
                    null,
                    [new FieldUpdate(
                      'this',
                      'x',
                      new Type(['Int']),
                      new Expression(
                        null,
                        [new Function(
                          new Parameter('this', new Call(null, 'x')),
                          '+',
                          new Parameter('dx', null)
                        )]
                      )
                    )]
                  ),
                )
              )
            ]),
            new Call(null, 'move', [new Int(5)]),
          ),
          new Call(null, 'move', [new Int(6)]),
        ),
        new Call(null, 'move', [new Int(-4)])
      ),
      new Call(null, "move", [new Int(-13)]),
    ),
    new Call(null, 'x')
  );
  
  export const sigma2 =
    new Sigma(
      new Sigma(
        new Sigma(
          new Sigma(
            new Sigma(
              new Sigma(
                new ObjectType([
                  new Field("arg", new Type(['Real']), new Float(0.0)),
                  new Field('acc', new Type(['Real']), new Float(0.0)),
                  new Method('clear', new Type(['Obj']), 'this', new Expression(
                    new Expression(
                      new Expression(
                        null,
                        [new FieldUpdate('this', 'arg', new Type(['Real']), new Float(0.0))]
                      ),
                      [new FieldUpdate(null, 'acc', new Type(['Real']), new Float(0.0))]
                    ),
                    [new MethodUpdate(null, 'equals', new Type(['Real']), 'self', new Expression(
                      null,
                      [new Call('self', 'arg')]
                    ))]
                  )),
                  new Method('enter', new Type(['Real', 'Obj']), 'this', new Lambda([new LambdaArg('n', new Type(['Real']))], new Expression(
                    null,
                    [new FieldUpdate('this', 'arg', new Type(['Real']), new Expression(null, [new Parameter('n', null)]))]
                  ))),
                  new Method('add', new Type(['Obj']), 'this', new Expression(
                    new Expression(
                      null,
                      [new FieldUpdate('this', 'acc', new Type(['Real']), new Expression(
                        null,
                        [new Call('this', 'equals')]
                      ))]
                    ),
                    [new MethodUpdate(null, 'equals', new Type(['Real']), 'self', new Expression(
                      null,
                      [new Function(
                        new Parameter('self', new Call(null, 'acc')),
                        '+',
                        new Parameter('self', new Call(null, 'arg'))
                      )]
                    ))]
                  )),
                  new Method('sub', new Type(['Obj']), 'this', new Expression(
                    new Expression(
                      null,
                      [new FieldUpdate('this', 'acc', new Type(['Real']), new Expression(
                        null,
                        [new Call('this', 'equals')]
                      ))]
                    ),
                    [new MethodUpdate(null, 'equals', new Type(['Real']), 'self', new Expression(
                      null,
                      [new Function(
                        new Parameter('self', new Call(null, 'acc')),
                        '-',
                        new Parameter('self', new Call(null, 'arg'))
                      )]
                    ))]
                  )),
                  new Method('equals', new Type(['Real']), 'this', new Expression(
                    null,
                    [new Call('this', 'arg')]
                  ))
                ]), new Call(null, 'enter', [new Float(5.0)])
              ), new Call(null, 'add')
            ), new Call(null, 'enter', [new Float(3.0)])
          ), new Call(null, 'sub')
        ), new Call(null, 'enter', [new Float(-2.2)])
      ), new Call(null, 'equals')
    );
  
  
  export const sigma3 = new Sigma(
    new Sigma(
      new Sigma(
        new Sigma(
          new Sigma(
            new Sigma(
              new Sigma(
                new ObjectType([
                  new Method('retrieve', new Type(['Obj']), 's', new Expression(
                    null,
                    [new Parameter('s', null)]
                  )),
                  new Method('backup', new Type(['Obj']), 'b', new Expression(
                    null,
                    [new MethodUpdate('b', 'retrieve', new Type(['Obj']), 's', new Expression(
                      null,
                      [new Parameter('b', null)]
                    ))
                    ]
                  )),
                  new Field('value', new Type(['Int']), new Int(10)),
                ]), new Call(null, 'backup')
              ), new FieldUpdate(null, 'value', new Type(['Int']), new Int(15))
            ), new Call(null, 'backup')
          ), new FieldUpdate(null, 'value', new Type(['Int']), new Int(25))
        ), new Call(null, 'retrieve')
      ), new Call(null, 'retrieve')
    ), new Call(null, 'value')
  );
  
  
  // const sigma4 = new Sigma(
  //   new ObjectType([
  //       new Method('zero', new Type('Obj'), 'global', new ObjectType(
  //           new Method('succ', new Type('Obj'), 'this', new Expression(
  //               new Expression(
  //                   new Expression(
  //                       null,
  //                       new FieldUpdate('this', 'ifzero', new Type('Obj'), new Expression(
  //                           null,
  //                           new Call('global','false'),
  //                       ))
  //                   ),
  //                   new FieldUpdate(null, 'pred', new Type('Obj'), new Expression(null,
  //                       new Parameter('this')
  //                   ))
  //               ),
  //               new FieldUpdate(null, 'num', new Type('Int'), new Expression(null,
  //                   new Function(new Parameter('this', new Call(null, 'num')), '+', new Parameter(new Int(1)))
  //               ))
  //           )),
  //           new Field('ifzero', new Type('Obj'), new Expression(
  //               null, new Call('global', 'true')
  //           )),
  //           new Field('num', new Type('Int'), new Int(0))
  //       )),
  //       new Method('true', new Type('Obj'), 'global', new ObjectType([
  //           new Method('then', new Type('Obj'), 'this', new Expression(null, new Parameter('this'))),
  //           new Method('val', new Type('Obj'), 'this', new Expression(
  //               null,
  //               new Call('this', 'then')
  //           ))
  //       ])),
  //       new Method('false', new Type('Obj'), 'global', new ObjectType([
  //           new Method('else', new Type('Obj'), 'this', new Expression(null, new Parameter('this'))),
  //           new Method('val', new Type('Obj'), 'this', new Expression(
  //               null,
  //               new Call('this', 'else')
  //           ))
  //       ])),
  //       new Method('prog', new Type('Int'), 'global', new Expression(
  //           new Expression(
  //               new Expression(
  //                   new Expression(
  //                       new Expression(null, new Call('global', 'zero')),
  //           new Call(null, 'succ')),
  //           new Call(null, 'succ')),
  //           new Call(null, 'pred')),
  //           new Call(null, 'num'))
  //       )
  //   ]), new Expression(null, new Call(null, 'prog'))
  // );
  
  export const sigma4 = new Sigma(
    new ObjectType(
      [
        new Method('zero', new Type(['Obj']), 'global', new ObjectType([
          new Method('succ', new Type(['Obj']), 'this', new Expression(new Expression(new Expression(null, [
            new FieldUpdate('this', 'ifzero', new Type(['Obj']), new Expression(null, [
              new Call('global', 'false')
            ]))
          ]), [
            new FieldUpdate(null, 'pred', new Type(['Obj']), new Expression(null, [new Parameter('this', null)]))
          ]), [
            new FieldUpdate(null, 'num', new Type(['Int']), new Expression(null, [
              new Function(new Parameter('this', new Call(null, 'num')), '+', new Parameter(new Int(1), null))
            ]))
          ])),
          new Field('ifzero', new Type(['Obj']), new Expression(null, [
            new Call('global', 'true')
          ])),
          new Field('num', new Type(['Int']), new Expression(null, [
            new Parameter(new Int(0), null)
          ])),
        ])),
        new Method('true', new Type(['Obj']), 'global', new ObjectType([
          new Method('then', new Type(['Obj']), 'this', new Expression(null, [
            new Parameter('this', null)
          ])),
          new Method('val', new Type(['Obj']), 'this', new Expression(null, [
            new Call('this', 'then')
          ]))
        ])),
        new Method('false', new Type(['Obj']), 'global', new ObjectType([
          new Method('else', new Type(['Obj']), 'this', new Expression(null, [
            new Parameter('this', null)
          ])),
          new Method('val', new Type(['Obj']), 'this', new Expression(null, [
            new Call('this', 'else')
          ]))
        ])),
        new Method('prog', new Type(['Int']), 'global', new Expression(null, [
          new Call('global', 'zero'),
          new Call(null, 'succ'),
          new Call(null, 'succ'),
          new Call(null, 'succ'),
          new Call(null, 'succ'),
          new Call(null, 'pred'),
          new Call(null, 'num')
        ]))
      ]), new Call(null, 'prog')
  );
  
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