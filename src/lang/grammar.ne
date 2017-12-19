@{%
import lexer from './lexer';
import {parseDate} from './utils';

const config = {
  'DEFAULT_YEAR': new Date().getFullYear().toString(),
  'DATE_FORMAT': 'd/m/y',
};
%}

@lexer lexer

SourceFile -> (Pragma | EOL):* TaskNodeList
  {% ([, nodes]) => ({pragmas: config, nodes}) %}

Pragma -> %pragma %ws %quoted EOL
  {% ([{value: pragma}, , {value}]) => {
    config[pragma] = value;
  } %}

TaskNodeList -> TaskNode:+
  {% id %}

TaskNode ->
    TaskGroup {% ([node]) => ({type: 'GROUP', ...node}) %}
  | Task {% ([node]) => ({type: 'TASK', ...node}) %}

TaskGroup ->
  TaskGroupHeader %indent TaskNodeList %dedent
  {% ([header, , children]) => ({ ...header, children }) %}

TaskGroupHeader ->
  %groupStart %ws Identifier Aliased:? EOL:+
  {% ([, , name, alias]) => ({ name, alias }) %}
  
Aliased ->
    %ws %lparen %ident %rparen {% ([, , name]) => name%}

Task ->
    %listStart %ws  %assigneeStart Identifier %ws %quoted (%ws TaskDetailsList):? EOL:+
    {%
      ([, , , assignee, , name, rest]) => {
        let [ , details] = rest || [];
        return {assignee, name, details};
      }
    %}

TaskDetailsList ->
    TaskDetails (%ws %detailListOp %ws TaskDetails):*
    {% ([details, rest]) => [details, ...rest.map(([, , , details]) => details)] %}

TaskDetails ->
    TaskTime (%ws Dedication):?
    {%
      ([time, rest]) => {
        let [ , dedication] = rest || [];
        return {...time, dedication};
      }
    %}
  | Dedication %ws TaskTime {% ([dedication, , time]) => ({...time, dedication}) %}

TaskTime ->
    From (%ws Until):?
    {%
      ([from, rest]) => {
        let [ , until] = rest || [];
        return {from, until};
      }
    %}
  | Duration (%ws From):?
    {%
      ([duration, rest]) => {
        let [ , from] = rest || [];
        return {from, until: {type: 'DURATION', duration}};
      }
    %}

From ->
    Date {% ([date]) => ({type: 'DATE', date}) %}
  | StartConstraint {% ([constraint]) => ({type: 'CONSTRAINT', constraint}) %}

Until ->
    Date {% ([date]) => ({type: 'DATE', date}) %}
  | Duration {% ([duration]) => ({type: 'DURATION', duration}) %}
  | FinishConstraint {% ([constraint]) => ({type: 'CONSTRAINT', ...constraint}) %}

FinishConstraint ->
    %finishConstraintOp Reference {% ([op, reference]) => ({op, reference}) %}

StartConstraint ->
    %startConstraintOp Reference:? {% ([op, reference]) => ({op, reference}) %}

Reference ->
    %ident {% id %}

Date -> %date
    {% 
      ([token]) => {
        let [a, b, c] = [...token.value, config.DEFAULT_YEAR];
        token.value = parseDate(config.DATE_FORMAT, [a, b, c]);
        return token;
      }
    %}

Duration ->
    %int %ws:? %duration
    {% ([amount, , unit]) => ({amount, unit}) %}
    
Dedication ->
    %int %percent {% id %}

Identifier ->
    %ident {% id %}
  | %quoted {% id %}

EOL -> %ws:? %comment:? %eol