import bind from "bind-decorator";
import * as classNames from "classnames/bind";
import * as React from "react";
import * as styles from "./TaskTreeHeader.css";

import { ResizeHandle } from "../../ResizeHandle/ResizeHandle";
import { IScrollSyncChildrenProps } from "../../ScrollSync/ScrollSync";
import { Viewport } from "../../Viewport/Viewport";
import { GroupExpander } from "../GroupExpander/GroupExpander";

const cx = classNames.bind(styles);

export type Column = any;

export interface ITaskTreeHeaderProps extends IScrollSyncChildrenProps {
  width: number;
  columns: Record<string, Column>;
  onColumnResize(column: string, dx: number);
}

export class TaskTreeHeader extends React.Component<ITaskTreeHeaderProps> {

  public static defaultProps: Partial<ITaskTreeHeaderProps> = {
    onColumnResize: () => undefined,
  };

  public render() {
    const {
      columns,
      width,
      onColumnResize,
      ...viewportProps,
    } = this.props;
    const colNames = Object.keys(columns);
    const colContent = {
      name: "Name",
      assignee: "Assignee",
      from: "Start",
      to: "Finish",
    };
    return (
      <Viewport className={cx("TaskTreeHeader")} {...viewportProps}>
        <div className={cx("TaskTreeHeader-row")} style={{ height: 49, width }} role="row">
          {colNames.map((colName) =>
            <div key={colName} className={cx("TaskTreeHeader-cell")} role="columnheader" style={{
              minWidth: columns[colName].width,
            }}>
              <div className={cx("TaskTreeHeader-cellContent")}>{colContent[colName]}</div>
              {
                columns[colName].resizable ?
                  <ResizeHandle className={cx("TaskTreeHeader-columnResizeHandle")} data={colName}
                    onResize={this.handleOnResizeColumn} />
                  : null
              }
            </div>,
          )}
          <div className={cx("TaskTreeHeader-cell")}></div>
        </div>
      </Viewport>
    );
  }

  @bind
  private handleOnResizeColumn([dx, dy], colName) {
    this.props.onColumnResize(colName, dx);
  }
}
