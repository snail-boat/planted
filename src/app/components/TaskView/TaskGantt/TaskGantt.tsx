import * as classNames from "classnames/bind";
import * as React from "react";
import * as styles from "./TaskGantt.css";

import { IFlattenedTask } from "../../../model/index";
import { IScrollSyncChildrenProps } from "../../ScrollSync/ScrollSync";
import { Viewport } from "../../Viewport/Viewport";
import { GroupExpander } from "../GroupExpander/GroupExpander";

const cx = classNames.bind(styles);

export interface ITaskGanttProps extends IScrollSyncChildrenProps {
  height: number;
  items: IFlattenedTask[];
  scale: number;
  range: [Date, Date];
  collapsed: Record<string, boolean>;
  onToggleRowExpand(item: IFlattenedTask, state: boolean);
}

export class TaskGantt extends React.Component<ITaskGanttProps> {

  private lastRenderSpan: [number, number];

  private get viewport() {
    return this.refs.viewport as Viewport;
  }
  public shouldComponentUpdate(nextProps) {
    if ([
      "onScroll", "height", "items", "collapsed", "scale", "range",
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
    console.log("render TaskGantt!");
    const {
      scrollTop,
      onScroll,
      scale,
      range,
      height,
      items,
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
    const width = (range[1].valueOf() - range[0].valueOf()) / scale;
    const commonProps = { scale, range, rowHeight: elemHeight };
    return (
      <Viewport ref="viewport" className={cx("TaskGantt")} onScroll={onScroll} scrollTop={scrollTop} {...viewportProps}>
        <div className={cx("TaskGantt-canvas")} style={{ height: totalHeight, width }}>
          {
            items.slice(from, to).map((item, i) => {
              const index = i + from;
              const props = { key: index, index, item, ...commonProps };
              return (
                item.type === "TASK"
                  ? <TaskGanttItemTask {...props} rowHeight={elemHeight} />
                  : <TaskGanttItemGroup {...props} expanded={!collapsed[item.id]} onToggleExpand={onToggleRowExpand} />
              );
            })
          }
          {/*
            <Dependency item1={items[0]} item2={items[2]} type="FS" index1={0} index={2} {...commonProps}>
            </Dependency>
          */}
        </div>
      </Viewport >
    );
  }
}

interface ITaskGanttItemTaskProps {
  item: IFlattenedTask;
  index: number;
  scale: number;
  range: [Date, Date];
  rowHeight: number;
}

const TaskGanttItemTask: React.SFC<ITaskGanttItemTaskProps> = ({ item, index, scale, range, rowHeight }) => {
  const top = index * rowHeight;
  const left = (item.from.valueOf() - range[0].valueOf()) / scale;
  const width = (item.to.valueOf() - item.from.valueOf()) / scale;
  return (
    <div className={cx("TaskGanttTask")} style={{ top, left, width, height: rowHeight }}>
      <div className={cx("TaskGanttTask-bar")}></div>
    </div>
  );
};

interface ITaskGanttItemGroupProps {
  item: IFlattenedTask;
  index: number;
  scale: number;
  range: [Date, Date];
  rowHeight: number;
  expanded: boolean;
  onToggleExpand(item: IFlattenedTask, state: boolean);
}

const TaskGanttItemGroup: React.SFC<ITaskGanttItemGroupProps> = ({
  item, index, scale, range, rowHeight, expanded, onToggleExpand,
}) => {
  const handleClick = () => onToggleExpand(item, expanded);
  const top = index * rowHeight;
  const left = (item.from.valueOf() - range[0].valueOf()) / scale;
  const width = (item.to.valueOf() - item.from.valueOf()) / scale;
  return (
    <div className={cx("TaskGanttGroup")} style={{ top, left, width, height: rowHeight }}>
      <div className={cx("TaskGanttGroup-expander")}>
        <GroupExpander expanded={expanded} onClick={handleClick} />
      </div>
      <div className={cx("TaskGanttGroup-bar")} onDoubleClick={handleClick}>
        <div className={cx("TaskGanttGroup-bar1")}></div>
        <div className={cx("TaskGanttGroup-bar2")}></div>
        <div className={cx("TaskGanttGroup-bar3")}></div>
      </div>
    </div>
  );
};

const linkOffset = 5;
const linkWidth = 2;
const linkColor = "red";
const minStraight = 10;
const margin = 5;

// "-|┘┐┌└";

// function getPath(item1, item2, index1, index2, type, scale, range, rowHeight) {
//   const start = [((type[0] === "S" ? item1.from : item1.to) - range[0]) / scale, (index1 + 0.5) * rowHeight];
//   const end = [((type[1] === "S" ? item2.from : item2.to) - range[0]) / scale, (index1 + 0.5) * rowHeight];
//   switch (type) {
//     case "FS": {
//     }
//   }
// }

const Dependency = ({ item1, item2, index1, index2, type, scale, range, rowHeight }) => {

  return (
    <div className={cx("dependency")}>
      {/* <HorizontalLink x1={start} x2={start + 20} y1={0} /> */}
    </div>
  );
};

// const HorizontalLink = ({ x1, y1, x2, y2 }) => {
//   return (
//     <div style={{
//       position: 'absolute',
//       top: y1 - linkOffset - linkWidth / 2,
//       left: x1,
//       width: x2 - x1,
//       paddingTop: linkOffset,
//       paddingBottom: linkOffset,
//     }}>
//       <div style={{
//         borderTopWidth: linkWidth,
//         borderTopStyle: 'solid',
//         borderTopColor: linkColor,
//       }}></div>
//     </div>
//   );
// }
