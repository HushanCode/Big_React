/* eslint-disable prettier/prettier */
import { Props, Key, Ref } from 'shared/ReactTypes';
import { WorkTag } from './workTags';
import { Flags, NoFlags } from './fiberFlags';
import { Container } from 'hostConfig';
export class FiberNode {
    type: any;
    tag: WorkTag;
    key: Key;
    stateNode: any;
    ref: Ref

    return: FiberNode | null;
    sibling: FiberNode | null;
    child: FiberNode | null;
    index: number;

    pendingProps: Props;
    memorizeProps: Props;
    memorizedState: any;

    alternate: FiberNode | null;
    flags: Flags;
    updateQueue: unknown;
    constructor(tag: WorkTag, pendingProps: Props, key: Key) {
        // =============实例属性==================
        this.tag = tag;
        this.key = key;
        // HostComponent div ,div DOM
        this.stateNode = null;
        // fiberNode的类型，比如FunctionComponent,就是函数组件本身
        this.type = null;

        // =============构成树状结构==================
        // 指向父fiberNode
        this.return = null;
        // 指向右侧兄弟fiberNode
        this.sibling = null;
        // 指向子fiberNode
        this.child = null;
        // 同级子节点index
        this.index = 0;

        this.ref = null;

        //====================作为工作单元============
        // 刚开始工作的props
        this.pendingProps = pendingProps;
        // 工作完确定的props
        this.memorizeProps = null;
        this.memorizedState = null;
        // 更新队列
        this.updateQueue = null;


        this.alternate = null;

        // 副作用
        this.flags = NoFlags;
    }
}

export class FiberRootNode {
    // 保存宿主环境的挂载节点
    container: Container;
    // hostRootFiber
    current: FiberNode;
    // 更新完成的hostRootFiber
    finishedWork: FiberNode | null;

    constructor (container: Container, hostRootFiber: FiberNode,) {
        this.container = container;
        this.current = hostRootFiber;
        hostRootFiber.stateNode = this;
        this.finishedWork = null;
    }
}

export const createWorkInProgress = (current: FiberNode, pendingProps: Props): FiberNode => {
    let wip = current.alternate;
    // 首屏渲染为null
    if(wip === null) {
        // mount
        wip = new FiberNode(current.tag, pendingProps, current.key);
        wip.stateNode = current.stateNode;

        wip.alternate = current;
        current.alternate = wip;
    } else {
        // update
        wip.pendingProps = pendingProps;
        // 清除副作用
        wip.flags = NoFlags;

    }
    wip.type = current.type;
    wip.updateQueue = current.updateQueue;
    wip.child = current.child;
    wip.memorizeProps = current.memorizeProps;
    wip.memorizedState = current.memorizedState;
    return wip;
}