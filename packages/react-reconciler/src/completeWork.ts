/* eslint-disable prettier/prettier */
/* eslint-disable prefer-const */
import {appendInitialChild, createInstance, createTextInstance } from 'hostConfig';
import { FiberNode } from './fiber';
import { HostComponent, HostRoot, HostText } from './workTags';
import { NoFlags } from './fiberFlags';

// 递归中的归阶段
export const completeWork = (wip: FiberNode) => {
	const newProps = wip.pendingProps;
	const current = wip.alternate;
	switch (wip.tag) {
		case HostComponent:
			// 1.构建DOM
			// 2.将DOM插入DOM树中
			if (current !== null && wip.stateNode) {
				// update
			} else {
				// 1.构建DOM
				const instance = createInstance(wip.type, newProps);
				// 2.将DOM插入DOM树中
				appendAllChildren(instance, wip);
				wip.stateNode = instance;
			}
			bubblleProperties(wip);
			return null;
		case HostText:
			// 1.构建DOM
			// 2.将DOM插入DOM树中
			if (current !== null && wip.stateNode) {
				// update
			} else {
				// 1.构建DOM
				const instance = createTextInstance(newProps.content);
				// 无孩子节点，不需要appendAllChildren
				wip.stateNode = instance;
			}
			bubblleProperties(wip);
			return null;
		case HostRoot:
			bubblleProperties(wip);
			return null;
		default:
			if (__DEV__) {
				console.warn('未处理的completeWork情况');
			}
			break;
	}
};

function appendAllChildren(parent: FiberNode, wip: FiberNode) {
	let node = wip.child;
	while (node !== null) {
		if (node.tag === HostComponent || node?.tag === HostText) {
			appendInitialChild(parent, node?.stateNode);
		} else if (node.child !== null) {
			node.child.return = node;
			node = node.child;
			continue;
		}

		if (node === wip) {
			return;
		}

		while (node.sibling === null) {
			if (node.return === null || node.return === wip) {
				return;
			}
			node = node?.return;
		}
		node.sibling.return = node.return;
		node = node.sibling;
	}
}

function bubblleProperties(wip: FiberNode) {
	let subtreeFlags = NoFlags;
	let child = wip.child;

	while (child !== null) {
		subtreeFlags |= child.subtreeFlags;
		subtreeFlags |= child.flags;

		child.return = wip;
		child = child.sibling;
	}

	wip.subtreeFlags |= subtreeFlags;
}
