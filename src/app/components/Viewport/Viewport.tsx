import bind from "bind-decorator";
import * as classNames from "classnames/bind";
import * as React from "react";
import * as styles from "./Viewport.css";

import getScrollbarWidth from "../../utils/getScrollbarWidth";
import { IScrollSyncChildrenProps } from "../ScrollSync/ScrollSync";

const cx = classNames.bind(styles);
const sw = getScrollbarWidth();
const scrollbarMargin = { marginRight: -sw, marginBottom: -sw };

export interface IViewportProps extends IScrollSyncChildrenProps {
  className?: string;
  dragToScroll?: boolean;
}

export class Viewport extends React.Component<IViewportProps> {

  public static defaultProps: Partial<IViewportProps> = {
    scrollTop: 0,
    scrollLeft: 0,
    onScroll: () => undefined,
    dragToScroll: false,
  };

  private viewport: HTMLDivElement;
  private mouseDown: boolean;
  private mousePosition: [number, number];

  public componentDidMount() {
    if (this.props.dragToScroll) {
      this.addListeners();
    }
  }

  public componentWillUnmount() {
    if (this.props.dragToScroll) {
      this.removeListeners();
    }
  }

  public componentDidUpdate(prevProps) {
    if (!this.props.ignoreScroll) {
      this.scrollTo(this.props.scrollTop, this.props.scrollLeft);
    }
    if (this.props.dragToScroll && !prevProps.dragToScroll) {
      this.addListeners();
    } else if (!this.props.dragToScroll && prevProps.dragToScroll) {
      this.removeListeners();
    }
  }

  public scrollTo(scrollTop, scrollLeft) {
    if (this.viewport.scrollTop !== scrollTop) {
      this.viewport.scrollTop = scrollTop;
    }
    if (this.viewport.scrollLeft !== scrollLeft) {
      this.viewport.scrollLeft = scrollLeft;
    }
  }

  public render() {
    const { children, onScroll, className } = this.props;
    const dragToScroll = this.props.dragToScroll ? { onMouseDown: this.handleMouseDown } : {};
    return (
      <div className={cx("Viewport", className)}>
        <div ref={this.setViewport} className={cx("Viewport-inner")} style={scrollbarMargin}
          onScroll={onScroll} {...dragToScroll}>
          {children}
        </div>
      </div>
    );
  }

  @bind
  private setViewport(ref) {
    this.viewport = ref;
  }

  private addListeners() {
    window.addEventListener("mousemove", this.handleMouseMove);
    window.addEventListener("mouseup", this.handleMouseUp);
  }

  private removeListeners() {
    window.removeEventListener("mousemove", this.handleMouseMove);
    window.removeEventListener("mouseup", this.handleMouseUp);
  }

  @bind
  private handleMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    this.mouseDown = true;
    this.mousePosition = [e.clientX, e.clientY];
  }

  @bind
  private handleMouseMove(e: MouseEvent) {
    if (this.mouseDown) {
      this.viewport.scrollLeft += this.mousePosition[0] - e.clientX;
      this.viewport.scrollTop += this.mousePosition[1] - e.clientY;
      this.mousePosition = [e.clientX, e.clientY];
      e.preventDefault();
    }
  }

  @bind
  private handleMouseUp(e: MouseEvent) {
    this.mouseDown = false;
  }
}
