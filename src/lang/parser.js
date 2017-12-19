import { compile } from 'moo';
import { Grammar, Parser } from 'nearley';
import grammar from './grammar';

let source = `
%DATE_FORMAT: "d/m/y"

# "Holidays" (HO)

  - @Gaba "hola que tal" 3w > + 4w >HO 50%
  - @"Santi Albo" "some task" 15/12/1988
  ## "fa feafea"
    - @Gaba "another task"
# "lol"
  - @wololo "design"
`;

let indent = 0;
let timeToString = (time) => {
  switch (time.type) {
    case 'DATE':
      return time.date.text;
    case 'DURATION':
      return time.duration.amount.value + time.duration.unit.value;
    case 'CONSTRAINT':
      return time.constraint.op.value
        + (time.constraint.reference ? time.constraint.reference.value : '');
  }
}

let detailsToString = (details = []) => {
  return (details.length > 0 ? ' ' : '') + details.map(({ from, until, dedication }) => {
    return timeToString(from)
      + (until ? ' ' + timeToString(until) : '')
      + (dedication ? ' ' + dedication.value + '%' : '');
  }).join(' + ');
}

let log = ({ type, name, assignee, details, alias, children }) => {
  switch (type) {
    case 'TASK':
      console.log(`${'  '.repeat(indent)}- @${assignee.text} ${name.text}${detailsToString(details)}`)
      break;
    case 'GROUP':
      console.log(`${'  '.repeat(indent)}${'#'.repeat(indent + 1)} ${name.text}${alias ? ` (${alias.text})` : ''}`)
      indent += 1;
      children.forEach(log);
      indent -= 1;
      break;
  }
};

var ast = parse(source)[0];
for (let node of ast.nodes) {
  log(node);
}


function parse(source) {
  const parser = new Parser(Grammar.fromCompiled(grammar));
  parser.feed(source);
  return parser.results;
}

module.exports = parse;

