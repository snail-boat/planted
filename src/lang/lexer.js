import { compile } from 'moo';

let lexer = compile({
  indent: {
    match: /^[\t ]+/,
    value: text => text.replace('\t', ' ').length
  },
  dedent: /[]/,
  ws: / +/,
  eol: { match: /(?:\r\n?|\n)+/, lineBreaks: true },
  comment: {
    match: /\/\/[^\n\r]*/, value: text => text.slice(2)
  },
  pragma: {
    match: /^%\w+:/,
    value: text => text.slice(1, -1)
  },
  listStart: /[*-]/,
  groupStart: /#+/,
  assigneeStart: '@',
  percent: '%',
  quoted: {
    match: /"(?:\\["\\]|[^\n"\\])*"/,
    value: text => text.slice(1, -1).replace(/\\([\"])/, "$1")
  },
  lparen: '(',
  rparen: ')',
  date: {
    match: /\d+\/\d+(?:\/\d+)?/,
    value: text => text.split('/').map((x) => parseInt(x, 10))
  },
  int: {
    match: /\d+/,
    value: text => parseInt(text, 10)
  },
  dateSeparator: '/',
  detailListOp: '+',
  startConstraintOp: ['>', '<', '<>', '<<'],
  finishConstraintOp: ['>>', '><'],
  // ident: {
  //     match: /\w+/, keywords: {
  //         duration: 'dwmy'.split('')
  //     }
  // }
  ident: /\w+/,
  duration: /[]/,
});

const _reset = lexer.reset;
const _next = lexer.next;

lexer.reset = function () {
  _reset.apply(lexer, arguments);
  let iter = tokens(_next.bind(lexer));
  lexer.next = function () {
    let token = iter.next().value;
    return token;
  }
}

function* tokens(getNext) {
  let stack = [];
  let [prev, curr] = [null, getNext()]
  while (curr) {
    let next = getNext();
    switch (curr && curr.type) {
      case 'ident':
        if (curr.value.match(/^(d(ays?)?|w(eeks?)?|m(onths?)?|y(ears?)?)$/)) {
          curr = { ...curr, type: 'duration', value: curr.value[0] };
        }
        yield curr;
        break;
      case 'indent': {
        if (next && (next.type === 'eol' || next.type === 'comment')) {
          yield { ...curr, value: curr.text, type: 'ws' };
          break;
        }
        let indent = curr.value;
        if (stack.length === 0) {
          yield curr;
          stack.push(indent);
        } else {
          let last = stack[stack.length - 1];
          if (indent > last) {
            yield curr;
            stack.push(indent);
          } else if (indent < last) {
            yield { type: 'dedent' };
            stack.pop();
          }
        }
        break;
      }
      default:
        if (prev && prev.type === 'eol') {
          for (let indent of stack) {
            yield { type: 'dedent' };
          }
          stack = [];
        }
        yield curr;
    }
    [prev, curr] = [curr, next];
  }
  for (let indent of stack) {
    yield { type: 'dedent' };
  }
}

export const lexer;