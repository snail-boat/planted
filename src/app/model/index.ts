export type ITask = ITaskItem | ITaskGroup;

interface ICommonTask {
    name: string;
    from: Date;
    to: Date;
}

export interface ITaskItem extends ICommonTask {
    type: "TASK";
}

export interface ITaskGroup extends ICommonTask {
    type: "GROUP";
    children: ITask[];
}

export type IFlattenedTask = ITask & {
    id: string;
    depth: number;
};

export function flattenTaskTree(
    taskTree: ITask[], collapsed, acc: IFlattenedTask[] = [], path = [], depth = 0): IFlattenedTask[] {
    taskTree.forEach((task, i) => {
        path = [...path, i];
        const id = path.join(".");
        acc.push({ ...task, depth, id });
        if (task.type === "GROUP" && !collapsed[id]) {
            flattenTaskTree(task.children, collapsed, acc, path, depth + 1);
        }
    });
    return acc;
}
