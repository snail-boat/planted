import { ScrollSync } from "./ScrollSync";

export type ScrollSyncId = string | number;

export type ScrollSyncFunc = (from: ScrollSyncId, to: ScrollSyncId, data: IScrollData) => Partial<IScrollData>;

export interface IScrollData {
  ignore?: boolean;
  scrollLeft: number;
  scrollTop: number;
}

export class ScrollSyncManager {
  private subscribers = [];
  constructor(private shouldSync: ScrollSyncFunc) {
  }

  public subscribe(scrollSync: ScrollSync) {
    this.subscribers.push(scrollSync);
    return () => {
      this.subscribers.splice(this.subscribers.indexOf(scrollSync), 1);
    };
  }

  public next(target: ScrollSyncId, scrollTop: number, scrollLeft: number) {
    this.subscribers.forEach((subscriber) => {
      const data = this.shouldSync(target, subscriber.props.id, { scrollTop, scrollLeft });
      if (data) {
        subscriber.scrollTo(data);
      }
    });
  }
}
