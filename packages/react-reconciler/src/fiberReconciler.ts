/* eslint-disable prettier/prettier */
import { Container } from 'hostConfig';
import { FiberNode, FiberRootNode } from './fiber';
import { HostRoot } from './workTags';
import { UpdateQueue, createUpdate, createUpdateQueue, enqueueUpdate } from './updateQueue';
import { ReactElementType } from 'shared/ReactTypes';
import { scheduleUpdateOnFiber } from './workLoop';

// 创建整个应用的根节点fiberRootNode，连接hostRootFiber
export function createContainer(container: Container) {
    const hostRootFiber = new FiberNode(HostRoot, {}, null);
    const root = new FiberRootNode(container, hostRootFiber);
    hostRootFiber.updateQueue = createUpdateQueue();
    return root;
}

// 当调用react.render方法的时候里面会调用这个
// 
export function updateContainer(
    element: ReactElementType | null, 
    root: FiberRootNode
) {
    const hostRootFiber = root.current;
    // 首屏渲染触发更新
    const update = createUpdate<ReactElementType | null>(element);
    // 创建完之后将它插入hostRootFiber的updateQueue
    enqueueUpdate(
        hostRootFiber?.updateQueue as UpdateQueue<ReactElementType | null>,
        update
    );
    scheduleUpdateOnFiber(hostRootFiber);
    return element;
}