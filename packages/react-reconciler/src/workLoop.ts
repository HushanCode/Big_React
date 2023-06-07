/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { beginWork } from './beginWork';
import { completeWork } from './completeWork';
import { FiberNode } from './fiber';

let workInProgress: FiberNode | null = null;

// 初始化操作
function prepareFreshStack(fiber: FiberNode) {
    workInProgress = fiber;
}

function renderRoot(root: FiberNode) {
    // 初始化
    prepareFreshStack(root);
    do {
        try {
            workLoop();
            break;
        } catch (e) {
            console.warn('workLoop发生错误');
            workInProgress = null;
        }
    } while (true);
}

function workLoop() {
    while (workInProgress !== null) {
        performUnitOfWork(workInProgress);
    }
}

function performUnitOfWork(fiber: FiberNode) {
    // next: 可能为null,可能为子fiber
    const next = beginWork(fiber);
    // beginWork工作完后赋值
    fiber.memorizeProps = fiber.pendingProps;

    // 没有子fiber，到最后一层了
    if (next === null) {
        completeUnitOfWork(fiber);
    } else {
        // 如果没有遍历到最下面，则遍历子节点
        workInProgress = next;
    }

}

function completeUnitOfWork(fiber: FiberNode) {
    let node: FiberNode | null = fiber;

    do {
        completeWork(node);
        const sibling = node.sibling;

        // 如果兄弟节点存在
        if (sibling !== null) {
            workInProgress = sibling;
            return;
        }

        node = node.return;
        workInProgress = node;
    } while (node !== null);
}