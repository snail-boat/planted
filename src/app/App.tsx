import bind from "bind-decorator";
import * as classNames from "classnames/bind";
import * as elementResizeDetectorMaker from "element-resize-detector";
import * as React from "react";
import * as styles from "./App.css";
import { Editor } from "./components/Editor/Editor";
import { TaskView } from "./components/TaskView/TaskView";

const cx = classNames.bind(styles);

interface IAppState {
  source: string;
}

class App extends React.Component<{}, IAppState> {

  private erd: any;
  private element: HTMLElement;
  constructor(props) {
    super(props);
    this.state = {
      source: `
%DATE_FORMAT: "d/m/y"

# "Holidays" (HO)

  - @Gaba "hola que tal" 3w > + 4w >HO 50%
  - @"Santi Albo" "some task" 15/12/1988
  ## "fa feafea"
    - @Gaba "another task"
# "lol"
  - @wololo "design"
`,
    };
    this.erd = elementResizeDetectorMaker();
  }

  public componentWillUpdate() {
    console.log("uninstalling");
    this.erd.uninstall(this.element);
  }

  public render() {
    const { source } = this.state;
    return (
      <div ref={this.setResizeDetector} className={cx("App")}>
        <TaskView />
        <Editor width={600} height={400} source={source} onChange={this.handleSourceChange} />
      </div>
    );
  }

  @bind
  private handleSourceChange(source, e) {
    this.setState({ source });
  }

  @bind
  private setResizeDetector(element) {
    console.log("installing");
    this.element = element;
    this.erd.listenTo(element, this.onElementResize);
  }

  @bind
  private onElementResize(element) {
    console.log(element.offsetWidth, element.offsetHeight);
  }
}

export default App;
