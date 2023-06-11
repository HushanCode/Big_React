/* eslint-disable prettier/prettier */
import { ReactElementType } from 'shared/ReactTypes';
import { FiberNode, createFiberFromElement } from './fiber';
import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols';
import { HostText } from './workTags';
import { Placement } from './fiberFlags';

// shouldTrackEffects是否追踪副作用
// 设计成闭包的形式：可以根据shouldTrackEffects返回不同的reconcileChildFibers实现
function ChildReconciler(shouldTrackEffects: boolean) {


    function reconcileSingleElement(
        // 父fiber
        returnFiber: FiberNode,
        // 当前fiber
        currentFiber: FiberNode | null,
        // reactElem
        element: ReactElementType,
    ) {
        //  根据reactElem创建fiber
        const fiber = createFiberFromElement(element);
        fiber.return = returnFiber;
        return fiber;
    }

    function reconcileSingleTextNode(
        // 父fiber
        returnFiber: FiberNode,
        // 当前fiber
        currentFiber: FiberNode | null,
        // 文本节点
        content: string | number,
    ) {
        const fiber = new FiberNode(HostText, { content }, null);
        fiber.return = returnFiber;
        return fiber;
    }

    // 插入单一节点
    function placeSingChild(fiber: FiberNode) {
        // 首屏渲染并且应该标记的情况下，才标记
        if (shouldTrackEffects && fiber.alternate === null) {
            fiber.flags |= Placement;
        }
        return fiber;
    }

    return function reconcileChildFibers(
        returnFiber: FiberNode,
        currentFiber: FiberNode | null,
        newChild?: ReactElementType,
    ) {
        // 判断当前fiber类型
        if (typeof newChild === 'object' && newChild !== null) {
            switch (newChild.$$typeof) {
                case REACT_ELEMENT_TYPE:
                    return placeSingChild(
                        reconcileSingleElement(
                            returnFiber,
                            currentFiber,
                            newChild
                        )
                    )
                default:
                    if (__DEV__) {
                        console.warn('未实现的reconciler类型', newChild);
                    }
                    break;
            }
        }
        // TODO多节点的情况 ul > li * 3

        // hostText,文本节点
        if (typeof newChild === 'string' || typeof newChild === 'number') {
            return placeSingChild(
                reconcileSingleTextNode(
                    returnFiber,
                    currentFiber,
                    newChild
                )
            )
        }

        if (__DEV__) {
            console.warn('未实现的reconciler类型', newChild);
        }
        return null;
    };
}

export const reconcileChildFibers = ChildReconciler(true);
export const mountChildFibers = ChildReconciler(false);

