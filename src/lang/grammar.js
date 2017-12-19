// Generated automatically by nearley
// http://github.com/Hardmath123/nearley
(function () {
function id(x) {return x[0]; }

const {parseDate} = require('./utils');
const config = {
  'DEFAULT_YEAR': new Date().getFullYear().toString(),
  'DATE_FORMAT': 'd/m/y',
};
const lexer = require('./lexer');
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "SourceFile$ebnf$1", "symbols": []},
    {"name": "SourceFile$ebnf$1$subexpression$1", "symbols": ["Pragma"]},
    {"name": "SourceFile$ebnf$1$subexpression$1", "symbols": ["EOL"]},
    {"name": "SourceFile$ebnf$1", "symbols": ["SourceFile$ebnf$1", "SourceFile$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "SourceFile", "symbols": ["SourceFile$ebnf$1", "TaskNodeList"], "postprocess": ([, nodes]) => ({pragmas: config, nodes})},
    {"name": "Pragma", "symbols": [(lexer.has("pragma") ? {type: "pragma"} : pragma), (lexer.has("ws") ? {type: "ws"} : ws), (lexer.has("quoted") ? {type: "quoted"} : quoted), "EOL"], "postprocess":  ([{value: pragma}, , {value}]) => {
          config[pragma] = value;
        } },
    {"name": "TaskNodeList$ebnf$1", "symbols": ["TaskNode"]},
    {"name": "TaskNodeList$ebnf$1", "symbols": ["TaskNodeList$ebnf$1", "TaskNode"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "TaskNodeList", "symbols": ["TaskNodeList$ebnf$1"], "postprocess": id},
    {"name": "TaskNode", "symbols": ["TaskGroup"], "postprocess": ([node]) => ({type: 'GROUP', ...node})},
    {"name": "TaskNode", "symbols": ["Task"], "postprocess": ([node]) => ({type: 'TASK', ...node})},
    {"name": "TaskGroup", "symbols": ["TaskGroupHeader", (lexer.has("indent") ? {type: "indent"} : indent), "TaskNodeList", (lexer.has("dedent") ? {type: "dedent"} : dedent)], "postprocess": ([header, , children]) => ({ ...header, children })},
    {"name": "TaskGroupHeader$ebnf$1", "symbols": ["Aliased"], "postprocess": id},
    {"name": "TaskGroupHeader$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "TaskGroupHeader$ebnf$2", "symbols": ["EOL"]},
    {"name": "TaskGroupHeader$ebnf$2", "symbols": ["TaskGroupHeader$ebnf$2", "EOL"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "TaskGroupHeader", "symbols": [(lexer.has("groupStart") ? {type: "groupStart"} : groupStart), (lexer.has("ws") ? {type: "ws"} : ws), "Identifier", "TaskGroupHeader$ebnf$1", "TaskGroupHeader$ebnf$2"], "postprocess": ([, , name, alias]) => ({ name, alias })},
    {"name": "Aliased", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws), (lexer.has("lparen") ? {type: "lparen"} : lparen), (lexer.has("ident") ? {type: "ident"} : ident), (lexer.has("rparen") ? {type: "rparen"} : rparen)], "postprocess": ([, , name]) => name},
    {"name": "Task$ebnf$1$subexpression$1", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws), "TaskDetailsList"]},
    {"name": "Task$ebnf$1", "symbols": ["Task$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "Task$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "Task$ebnf$2", "symbols": ["EOL"]},
    {"name": "Task$ebnf$2", "symbols": ["Task$ebnf$2", "EOL"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Task", "symbols": [(lexer.has("listStart") ? {type: "listStart"} : listStart), (lexer.has("ws") ? {type: "ws"} : ws), (lexer.has("assigneeStart") ? {type: "assigneeStart"} : assigneeStart), "Identifier", (lexer.has("ws") ? {type: "ws"} : ws), (lexer.has("quoted") ? {type: "quoted"} : quoted), "Task$ebnf$1", "Task$ebnf$2"], "postprocess": 
        ([, , , assignee, , name, rest]) => {
          let [ , details] = rest || [];
          return {assignee, name, details};
        }
            },
    {"name": "TaskDetailsList$ebnf$1", "symbols": []},
    {"name": "TaskDetailsList$ebnf$1$subexpression$1", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws), (lexer.has("detailListOp") ? {type: "detailListOp"} : detailListOp), (lexer.has("ws") ? {type: "ws"} : ws), "TaskDetails"]},
    {"name": "TaskDetailsList$ebnf$1", "symbols": ["TaskDetailsList$ebnf$1", "TaskDetailsList$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "TaskDetailsList", "symbols": ["TaskDetails", "TaskDetailsList$ebnf$1"], "postprocess": ([details, rest]) => [details, ...rest.map(([, , , details]) => details)]},
    {"name": "TaskDetails$ebnf$1$subexpression$1", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws), "Dedication"]},
    {"name": "TaskDetails$ebnf$1", "symbols": ["TaskDetails$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "TaskDetails$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "TaskDetails", "symbols": ["TaskTime", "TaskDetails$ebnf$1"], "postprocess": 
        ([time, rest]) => {
          let [ , dedication] = rest || [];
          return {...time, dedication};
        }
            },
    {"name": "TaskDetails", "symbols": ["Dedication", (lexer.has("ws") ? {type: "ws"} : ws), "TaskTime"], "postprocess": ([dedication, , time]) => ({...time, dedication})},
    {"name": "TaskTime$ebnf$1$subexpression$1", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws), "Until"]},
    {"name": "TaskTime$ebnf$1", "symbols": ["TaskTime$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "TaskTime$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "TaskTime", "symbols": ["From", "TaskTime$ebnf$1"], "postprocess": 
        ([from, rest]) => {
          let [ , until] = rest || [];
          return {from, until};
        }
            },
    {"name": "TaskTime$ebnf$2$subexpression$1", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws), "From"]},
    {"name": "TaskTime$ebnf$2", "symbols": ["TaskTime$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "TaskTime$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "TaskTime", "symbols": ["Duration", "TaskTime$ebnf$2"], "postprocess": 
        ([duration, rest]) => {
          let [ , from] = rest || [];
          return {from, until: {type: 'DURATION', duration}};
        }
            },
    {"name": "From", "symbols": ["Date"], "postprocess": ([date]) => ({type: 'DATE', date})},
    {"name": "From", "symbols": ["StartConstraint"], "postprocess": ([constraint]) => ({type: 'CONSTRAINT', constraint})},
    {"name": "Until", "symbols": ["Date"], "postprocess": ([date]) => ({type: 'DATE', date})},
    {"name": "Until", "symbols": ["Duration"], "postprocess": ([duration]) => ({type: 'DURATION', duration})},
    {"name": "Until", "symbols": ["FinishConstraint"], "postprocess": ([constraint]) => ({type: 'CONSTRAINT', ...constraint})},
    {"name": "FinishConstraint", "symbols": [(lexer.has("finishConstraintOp") ? {type: "finishConstraintOp"} : finishConstraintOp), "Reference"], "postprocess": ([op, reference]) => ({op, reference})},
    {"name": "StartConstraint$ebnf$1", "symbols": ["Reference"], "postprocess": id},
    {"name": "StartConstraint$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "StartConstraint", "symbols": [(lexer.has("startConstraintOp") ? {type: "startConstraintOp"} : startConstraintOp), "StartConstraint$ebnf$1"], "postprocess": ([op, reference]) => ({op, reference})},
    {"name": "Reference", "symbols": [(lexer.has("ident") ? {type: "ident"} : ident)], "postprocess": id},
    {"name": "Date", "symbols": [(lexer.has("date") ? {type: "date"} : date)], "postprocess":  
        ([token]) => {
          let [a, b, c] = [...token.value, config.DEFAULT_YEAR];
          token.value = parseDate(config.DATE_FORMAT, [a, b, c]);
          return token;
        }
            },
    {"name": "Duration$ebnf$1", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": id},
    {"name": "Duration$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "Duration", "symbols": [(lexer.has("int") ? {type: "int"} : int), "Duration$ebnf$1", (lexer.has("duration") ? {type: "duration"} : duration)], "postprocess": ([amount, , unit]) => ({amount, unit})},
    {"name": "Dedication", "symbols": [(lexer.has("int") ? {type: "int"} : int), (lexer.has("percent") ? {type: "percent"} : percent)], "postprocess": id},
    {"name": "Identifier", "symbols": [(lexer.has("ident") ? {type: "ident"} : ident)], "postprocess": id},
    {"name": "Identifier", "symbols": [(lexer.has("quoted") ? {type: "quoted"} : quoted)], "postprocess": id},
    {"name": "EOL$ebnf$1", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": id},
    {"name": "EOL$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "EOL$ebnf$2", "symbols": [(lexer.has("comment") ? {type: "comment"} : comment)], "postprocess": id},
    {"name": "EOL$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "EOL", "symbols": ["EOL$ebnf$1", "EOL$ebnf$2", (lexer.has("eol") ? {type: "eol"} : eol)]}
]
  , ParserStart: "SourceFile"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
