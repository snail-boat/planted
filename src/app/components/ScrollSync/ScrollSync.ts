import bind from "bind-decorator";
import * as React from "react";
import { IScrollData, ScrollSyncManager } from "../ScrollSync/ScrollSyncManager";

export interface IScrollSyncProps {
  id: string | number;
  manager: ScrollSyncManager;
  children: React.ReactElement<React.Component<IScrollSyncChildrenProps>>;
}

export interface IScrollSyncState {
  ignoreScroll: boolean;
  scrollLeft: number;
  scrollTop: number;
}

export interface IScrollSyncChildrenProps extends Partial<IScrollSyncState> {
  onScroll?(event: any);
}

export class ScrollSync extends React.Component<IScrollSyncProps, IScrollSyncState> {
  private forcedScroll = false;
  private unsubscribe;
  constructor(props) {
    super(props);
    this.state = {
      ignoreScroll: true,
      scrollLeft: 0,
      scrollTop: 0,
    };
    this.forcedScroll = false;
  }

  public componentWillMount() {
    this.unsubscribe = this.props.manager.subscribe(this);
  }

  public componentWillUnmount() {
    this.unsubscribe();
  }

  public scrollTo({ ignore, ...data }: Partial<IScrollData>) {
    if (!ignore) {
      this.forcedScroll = true;
    }
    this.setState({
      ignoreScroll: false,
      ...data as any,
    });
  }

  public render() {
    return React.cloneElement(this.props.children, { onScroll: this.handleOnScroll, ...this.state });
  }

  @bind
  private handleOnScroll(event: any) {
    if (this.forcedScroll) {
      this.forcedScroll = false;
      return;
    }
    this.props.manager.next(this.props.id, event.target.scrollTop, event.target.scrollLeft);
    this.setState({
      ignoreScroll: true,
      scrollLeft: event.target.scrollLeft,
      scrollTop: event.target.scrollTop,
    });
  }
}
