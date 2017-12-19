import bind from "bind-decorator";
import * as classNames from "classnames/bind";
import * as React from "react";
import * as styles from "./ResizeHandle.css";

const cx = classNames.bind(styles);

export interface IResizeHandleProps {

  /*
   * class name to add to the rendered div element.
   */
  className?: string;

  /*
   * styles to apply to the rendered div element.
   */
  style?: any;

  /*
   * data that will be send as an argument in the different event handlers.
   */
  data?: any;

  onDoubleClick?(data: any, event: any);
  onResize?(delta: [number, number], data: any): any;
}

export class ResizeHandle extends React.Component<IResizeHandleProps> {

  public static defaultProps: Partial<IResizeHandleProps> = {
  };

  private mouseDown: boolean;
  private mousePosition: [number, number];

  public componentDidMount() {
    window.addEventListener("mousemove", this.handleMouseMove);
    window.addEventListener("mouseup", this.handleMouseUp);
  }

  public componentWillUnmount() {
    window.removeEventListener("mousemove", this.handleMouseMove);
    window.removeEventListener("mouseup", this.handleMouseUp);
  }

  public render() {
    const { className, data, children, onResize, onDoubleClick, style } = this.props;
    const props = {
      ...(style ? { style } : {}),
      ...(onDoubleClick ? { onDoubleClick: this.handleDoubleClick } : {}),
    };
    return (
      <div className={cx("ResizeHandle", className)} onMouseDown={this.handleMouseDown} {...props}></div>
    );
  }

  @bind
  private handleDoubleClick(e: any) {
    this.props.onDoubleClick(this.props.data, e);
  }

  @bind
  private handleMouseDown(e: any) {
    this.mouseDown = true;
    this.mousePosition = [e.clientX, e.clientY];
  }

  @bind
  private handleMouseMove(e: any) {
    if (this.mouseDown) {
      const delta: [number, number] = [e.clientX - this.mousePosition[0], e.clientY - this.mousePosition[1]];
      if (this.props.onResize) {
        this.props.onResize(delta, this.props.data);
      }
      this.mousePosition = [e.clientX, e.clientY];
      if ((document as any).selection) {
        (document as any).selection.empty();
      } else {
        window.getSelection().removeAllRanges();
      }
    }
  }

  @bind
  private handleMouseUp() {
    this.mouseDown = false;
  }
}
