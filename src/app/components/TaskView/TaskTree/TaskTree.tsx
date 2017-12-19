import * as classNames from "classnames/bind";
import * as React from "react";
import * as styles from "./TaskTree.css";

import { IFlattenedTask } from "../../../model/index";
import { IScrollSyncChildrenProps } from "../../ScrollSync/ScrollSync";
import { Viewport } from "../../Viewport/Viewport";
import { GroupExpander } from "../GroupExpander/GroupExpander";
import { IColumn } from "../TaskView";

const cx = classNames.bind(styles);

export interface ITaskTreeProps extends IScrollSyncChildrenProps {
  height: number;
  width: number;
  items: IFlattenedTask[];
  collapsed: Record<string, boolean>;
  columns: Record<string, IColumn>;
  onToggleRowExpand(item: IFlattenedTask, state: boolean);
}

export class TaskTree extends React.Component<ITaskTreeProps> {
  public static defaultProps: Partial<ITaskTreeProps> = {
    scrollTop: 0,
    scrollLeft: 0,
  };

  private lastRenderSpan: [number, number];

  private get viewport() {
    return this.refs.viewport as Viewport;
  }

  public shouldComponentUpdate(nextProps) {
    if ([
      "onScroll", "height", "width", "items", "collapsed", "columns",
    ].some((prop) => this.props[prop] !== nextProps[prop])) {
      return true;
    }
    const { scrollTop, height, items } = nextProps;
    const elemHeight = 30;
    const offset = 0.3;
    const totalHeight = elemHeight * items.length;
    const fromHeight = Math.max(scrollTop - height * offset, 0);
    const toHeight = Math.min(scrollTop + height * (1 + offset), totalHeight);
    if (this.lastRenderSpan &&
      fromHeight >= this.lastRenderSpan[0] && toHeight <= this.lastRenderSpan[1]) {
      if (!nextProps.ignoreScroll) {
        this.viewport.scrollTo(nextProps.scrollTop, nextProps.scrollLeft);
      }
      return false;
    }
    return true;
  }

  public render() {
    console.log("render TaskTree!");
    const {
      scrollTop,
      onScroll,
      height,
      width,
      items,
      columns,
      collapsed,
      onToggleRowExpand,
      ...viewportProps,
    } = this.props;
    const elemHeight = 30;
    const offset = 1;
    const totalHeight = elemHeight * items.length;
    const fromHeight = Math.max(scrollTop - height * offset, 0);
    const toHeight = Math.min(scrollTop + height * (1 + offset), totalHeight);
    this.lastRenderSpan = [fromHeight, toHeight];
    const from = Math.max(0, Math.floor(fromHeight / elemHeight));
    const to = Math.min(items.length, Math.ceil(toHeight / elemHeight));
    return (
      <Viewport ref="viewport" className={cx("TaskTree")} onScroll={onScroll} scrollTop={scrollTop} {...viewportProps}>
        <div className={cx("TaskTree-canvas")} style={{ height: totalHeight }}>
          {
            items.slice(from, to).map((item, i) => {
              const index = i + from;
              return (
                <TaskTreeRow key={index} item={item} columns={columns} top={index * elemHeight} rowHeight={elemHeight}
                  width={width} expanded={!collapsed[item.id]} onToggleExpand={onToggleRowExpand} />
              );
            })
          }
        </div>
      </Viewport >
    );
  }
}

interface ITaskTreeRowProps {
  item: IFlattenedTask;
  columns: Record<string, IColumn>;
  top: number;
  rowHeight: number;
  width: number;
  expanded: boolean;
  onToggleExpand(item: IFlattenedTask, state: boolean);
}

const TaskTreeRow: React.SFC<ITaskTreeRowProps> = ({
  item, columns, top, rowHeight, width, onToggleExpand, expanded,
}) => {
  const cells = [];
  if (item.type === "TASK") {
    cells.push(
      <TaskTreeRowCell key="name" item={item} width={columns.name.width} indent={true}>
        {item.name}
      </TaskTreeRowCell>,
      <TaskTreeRowCell key="assignee" item={item} width={columns.assignee.width}>
        {"Pablo"}
      </TaskTreeRowCell>,
    );
  } else {
    const handleClick = () => onToggleExpand(item, expanded);
    cells.push(
      <TaskTreeRowCell key="name" item={item} width={columns.name.width} indent={true}>
        <GroupExpander expanded={expanded} onClick={handleClick} />
        {item.name}
      </TaskTreeRowCell>,
      <TaskTreeRowCell key="assignee" item={item} width={columns.assignee.width}>
      </TaskTreeRowCell>,
    );
  }
  cells.push(
    <TaskTreeRowCell key="from" item={item} width={columns.from.width}>
      {item.from.toLocaleDateString()}
    </TaskTreeRowCell>,
    <TaskTreeRowCell key="to" item={item} width={columns.to.width}>
      {item.to.toLocaleDateString()}
    </TaskTreeRowCell>,
  );
  return (
    <div className={cx("TaskTreeRow", { "TaskTreeRow-group": item.type === "GROUP" })} role="row"
      style={{ top, height: rowHeight, width }}>
      {cells}
      <div className={cx("TaskTreeRow-cell")}></div>
    </div>
  );
};

interface ITaskTreeRowCellProps {
  item: IFlattenedTask;
  width: number;
  indent?: boolean;
}

const TaskTreeRowCell: React.SFC<ITaskTreeRowCellProps> = ({ item, width, children, indent = false }) => (
  <div className={cx("TaskTreeRow-cell")} role="cell" style={{ minWidth: width }}>
    {indent ? <div style={{ width: 25 * item.depth, minWidth: 25 * item.depth }}></div> : null}
    <div className={cx("TaskTreeRow-cellContent")}>
      {children}
    </div>
  </div>
);
