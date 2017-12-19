// tslint:disable-next-line:no-reference
/// <reference path="../../../../node_modules/monaco-editor/monaco.d.ts" />

import bind from "bind-decorator";
import propTypes from "prop-types";
import * as React from "react";
import MonacoEditor from "react-monaco-editor";

export interface IPlantedEditorProps {
  height: number;
  width: number;
  source: string;
  onChange(source: string, change: monaco.editor.IModelContentChangedEvent);
}

export interface IPlantedEditorState {
  source: string;
}

export class Editor extends React.Component<IPlantedEditorProps, IPlantedEditorState> {
  constructor(props) {
    super(props);
    this.state = {
      source: props.source || "",
    };
  }

  public render() {
    const source = this.state.source;
    const options = {
      selectOnLineNumbers: true,
    };
    return (
      <MonacoEditor
        height={this.props.height}
        language="planted"
        theme="vs-dark"
        value={source}
        options={options}
        onChange={this.props.onChange}
        editorWillMount={this.editorWillMount}
      />
    );
  }

  @bind
  private editorWillMount(m: typeof monaco) {
    m.languages.register({ id: "planted" });
    m.languages.registerCompletionItemProvider("planted", {
      provideCompletionItems: () => {
        return [
          {
            label: "task",
            kind: m.languages.CompletionItemKind.Snippet,
            insertText: {
              value: '- @${1:assignee} "$0"',
            },
            documentation: "New task",
          },
          {
            label: "Group",
            kind: m.languages.CompletionItemKind.Snippet,
            insertText: {
              value: '# "${1:assignee}" (${0:alias})',
            },
            documentation: "New task group",
          },
        ];
      },
    });
  }
}
