import * as css from "dom-css";

const scrollbarWidthSet = false;
let scrollbarWidth = 0;

export default function getScrollbarWidth() {
  if (scrollbarWidthSet) {
    return scrollbarWidth;
  }
  if (typeof document !== "undefined") {
    const div = document.createElement("div");
    css(div, {
      width: 100,
      height: 100,
      position: "absolute",
      top: -9999,
      overflow: "scroll",
      MsOverflowStyle: "scrollbar",
    });
    document.body.appendChild(div);
    scrollbarWidth = (div.offsetWidth - div.clientWidth);
    document.body.removeChild(div);
  } else {
    scrollbarWidth = 0;
  }
  return scrollbarWidth;
}
