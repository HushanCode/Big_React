/* eslint-disable prettier/prettier */
import { mountChildFibers, reconcileChildFibers } from './childFIbers';
import { FiberNode } from './fiber';
import { UpdateQueue, processUpdateQueue } from './updateQueue';
import { HostComponent, HostRoot, HostText } from './workTags';
import { ReactElementType } from 'shared/ReactTypes';

// 递归中的递阶段
export const beginWork = (wip: FiberNode) => {
	// 比较返回的fiberNode
	switch (wip.tag) {
		case HostRoot:
			return updateHostRoot(wip);
		case HostComponent:
			return updateHostComponent(wip);
		case HostText:
			// 没有子节点
			return null;
		default:
			if (__DEV__) {
				console.warn('beginWork未实现的类型');
			}
			break;
	}
	return null;
};

function updateHostRoot(wip: FiberNode) {
	// 计算装填最新值
	// 创建子fiberNode
	// 基础状态
	const baseState = wip.memorizedState;
	// 更新队列
	const updateQueue = wip.updateQueue as UpdateQueue<Element>;
	const pending = updateQueue.shared.pending;
	updateQueue.shared.pending = null;
	// 计算的最新值
	const { memorizedState } = processUpdateQueue(baseState, pending);
	wip.memorizedState = memorizedState;
	const nextChildren = wip.memorizedState;
	// 返回子fiber
	reconcileChildren(wip, nextChildren);
	return wip.child;
}

function updateHostComponent(wip: FiberNode) {
	const nextProps = wip.pendingProps;
	const nextChildren = nextProps.children;
	reconcileChildren(wip, nextChildren);
	return wip.child;
}

function reconcileChildren(wip: FiberNode, children?: ReactElementType) {
	// 对比的是子节点的current fiberNode和ReactElem，所以要current
	const current = wip.alternate;
	if(current !== null) {
		// update
		wip.child = reconcileChildFibers(wip, current?.child, children);
	} else {
		// mount
		wip.child = mountChildFibers(wip, null, children);
	}
}
