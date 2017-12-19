import * as classNames from "classnames/bind";
import * as React from "react";
import * as styles from "./GroupExpander.css";

const cx = classNames.bind(styles);

export interface IGroupExpanderProps {
  expanded: boolean;
  onClick(e: React.SyntheticEvent<HTMLDivElement>);
}

export const GroupExpander = ({ onClick, expanded }: IGroupExpanderProps) => (
  <div className={cx("GroupExpander", { "GroupExpander--expanded": expanded })}
    role="button" aria-expanded={expanded} onClick={onClick}></div>
);
