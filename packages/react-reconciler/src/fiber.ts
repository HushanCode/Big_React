/* eslint-disable prettier/prettier */
import { Props, Key, Ref } from 'shared/ReactTypes';
import { WorkTag } from './workTags';
import { Flags, NoFlags } from './fiberFlags';
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

    alternate: FiberNode | null;
    flags: Flags;
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

        this.alternate = null;

        // 副作用
        this.flags = NoFlags;
    }
}
