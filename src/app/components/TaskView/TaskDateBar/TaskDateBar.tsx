import * as classNames from "classnames/bind";
import * as React from "react";
import * as styles from "./TaskDateBar.css";

import { IScrollSyncChildrenProps } from "../../ScrollSync/ScrollSync";
import { Viewport } from "../../Viewport/Viewport";

const cx = classNames.bind(styles);

export interface ITaskDateBarProps extends IScrollSyncChildrenProps {
  scale: number;
  range: [Date, Date];
}

export class TaskDateBar extends React.Component<ITaskDateBarProps> {

  public render() {
    const {
      range,
      scale,
      ...viewportProps,
    } = this.props;
    const width = (range[1].valueOf() - range[0].valueOf()) / scale;
    return (
      <Viewport className={cx("TaskDateBar")} {...viewportProps} dragToScroll={true}>
        <div className={cx("TaskDateBar-canvas")} style={{ width, height: 49 }}>
        </div>
      </Viewport>
    );
  }
}
