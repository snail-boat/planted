import bind from "bind-decorator";
import * as classNames from "classnames/bind";
import * as React from "react";

import { flattenTaskTree, IFlattenedTask, ITask } from "../../model";
import { ResizeHandle } from "../ResizeHandle/ResizeHandle";
import { ScrollSync } from "../ScrollSync/ScrollSync";
import { ScrollSyncManager } from "../ScrollSync/ScrollSyncManager";
import { TaskDateBar } from "./TaskDateBar/TaskDateBar";
import { TaskGantt } from "./TaskGantt/TaskGantt";
import { TaskTree } from "./TaskTree/TaskTree";
import { TaskTreeHeader } from "./TaskTreeHeader/TaskTreeHeader";
import * as styles from "./TaskView.css";

const cx = classNames.bind(styles);

export interface IColumn {
  width: number;
  resizable?: boolean;
  minWidth?: number;
}

let tree: ITask[] = [
  { name: "Task1", type: "TASK", from: new Date(2017, 1, 1), to: new Date(2017, 1, 6) },
  {
    name: "Group 1", type: "GROUP", from: new Date(2017, 1, 1), to: new Date(2017, 2, 5), children: [
      { name: "Task2", type: "TASK", from: new Date(2017, 1, 3), to: new Date(2017, 1, 8) },
      { name: "Task3", type: "TASK", from: new Date(2017, 1, 9), to: new Date(2017, 1, 16) },
      {
        name: "Group 2", type: "GROUP", from: new Date(2017, 2, 1), to: new Date(2017, 2, 6), children: [
          { name: "Task5", type: "TASK", from: new Date(2017, 2, 1), to: new Date(2017, 2, 5) },
          {
            name: "Group 3", type: "GROUP", from: new Date(2017, 2, 1), to: new Date(2017, 2, 6), children: [
              { name: "Task6", type: "TASK", from: new Date(2017, 2, 1), to: new Date(2017, 2, 6) },
            ],
          },
        ],
      },
      { name: "Task4", type: "TASK", from: new Date(2017, 1, 16), to: new Date(2017, 2, 1) },
    ],
  },
];

tree = [...tree, ...tree, ...tree, ...tree, ...tree, ...tree];

// 1 px = 1/20 day
const scale = (1000 * 60 * 60 * 24) / 20;
const range: [Date, Date] = [new Date(2017, 0, 28), new Date(2017, 3, 1)];

const collapsed: Record<string, boolean> = {};
const items = flattenTaskTree(tree, collapsed);

let columns: Record<string, IColumn> = {
  name: {
    minWidth: 150,
    width: 200,
    resizable: true,
  },
  assignee: {
    minWidth: 100,
    width: 100,
    resizable: true,
  },
  from: {
    width: 100,
  },
  to: {
    width: 100,
  },
};

// tslint:disable-next-line:no-empty-interface
export interface ITaskViewProps {
}

export interface ITaskViewState {
  items: IFlattenedTask[];
  leftPanelWidth: number;
}

export class TaskView extends React.Component<ITaskViewProps, ITaskViewState> {
  private manager: ScrollSyncManager;
  constructor(props) {
    super(props);

    this.state = {
      items,
      // scroll: { data: { scrollTop: 0, scrollLeft: 0 } },
      leftPanelWidth: 500,
    };

    const match = (from1, to1, from2, to2) =>
      (from1 === from2 && to1 === to2) || (from1 === to2 && to1 === from2);
    this.manager = new ScrollSyncManager((from, to, data) => {
      if (match("tree-header", "tree", from, to)) {
        return { scrollLeft: data.scrollLeft };
      }
      if (match("date-bar", "gantt", from, to)) {
        return { scrollLeft: data.scrollLeft };
      }
      if (match("tree", "gantt", from, to)) {
        return { scrollTop: data.scrollTop };
      }
    });
  }

  public render() {
    const items = flattenTaskTree(tree, collapsed);
    const lpw = this.state.leftPanelWidth;
    const height = 300;
    const headerHeight = 50;
    const panelHeight = height - headerHeight;
    const colNames = Object.keys(columns);
    const treeWidth = colNames.reduce((acc, col) => acc + columns[col].width, 0);
    return (
      <div className={cx("TaskView")} style={{ height }}>
        <div className={cx("TaskView-left", "TaskView-top")} style={{ width: lpw, zIndex: 4 }}>
          <ScrollSync id={"tree-header"} manager={this.manager}>
            <TaskTreeHeader width={Math.max(lpw, treeWidth)} columns={columns}
              onColumnResize={this.handleColumnResize} />
          </ScrollSync>
        </div>
        <div className={cx("TaskView-left", "TaskView-bottom")} style={{ width: lpw, zIndex: 3 }}>
          <ScrollSync id={"tree"} manager={this.manager}>
            <TaskTree width={Math.max(lpw, treeWidth)} height={panelHeight} columns={columns}
              items={items} collapsed={collapsed} onToggleRowExpand={this.handleToggleRowExpand} />
          </ScrollSync>
        </div>
        <div className={cx("TaskView-right", "TaskView-top")} style={{ left: lpw, zIndex: 2 }}>
          <ScrollSync id={"date-bar"} manager={this.manager}>
            <TaskDateBar range={range} scale={scale} />
          </ScrollSync>
        </div>
        <div className={cx("TaskView-right", "TaskView-bottom")} style={{ left: lpw, zIndex: 1 }}>
          <ScrollSync id={"gantt"} manager={this.manager}>
            <TaskGantt range={range} height={panelHeight} items={items} collapsed={collapsed}
              scale={scale} onToggleRowExpand={this.handleToggleRowExpand} />
          </ScrollSync>
        </div>
        <ResizeHandle className={cx("TaskView-resizeHandle")} style={{ left: lpw }}
          onResize={this.handlePanelResize} onDoubleClick={this.handleResizeHandlerDblClick} />
      </div >
    );
  }

  @bind
  private handlePanelResize([dx, dy]) {
    this.setState({
      leftPanelWidth: this.state.leftPanelWidth + dx,
    });
  }

  @bind
  private handleToggleRowExpand(item, state) {
    collapsed[item.id] = state;
    this.forceUpdate();
  }

  @bind
  private handleResizeHandlerDblClick() {
    this.setState({
      leftPanelWidth: 500,
    });
  }

  @bind
  private handleColumnResize(column, dx) {
    const col = columns[column];
    columns = {
      ...columns,
      [column]: {
        ...col,
        width: Math.max(col.minWidth, col.width + dx),
      },
    };
    this.forceUpdate();
  }
}
