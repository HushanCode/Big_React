/* eslint-disable prettier/prettier */
import { Action } from 'shared/ReactTypes';

export interface Update<State> {
    action: Action<State>;

}

export interface UpdateQueue<State> {
    shared: {
        pending: Update<State> | null;
    }
}

// 创建更新对象
export const createUpdate = <State>(action: Action<State>) => {
    return {
        action
    }
};

// 创建更新队列
export const createUpdateQueue = <Action>() => {
    return {
        shared: {
            pending: null
        }
    } as UpdateQueue<Action>
};

// 往updateQueue中加入update
export const enqueueUpdate = <Action>(
    updateQueue: UpdateQueue<Action>,
    update: Update<Action>
) => {
    updateQueue.shared.pending = update;
}

// 消费update
export const processUpdateQueue = <State>(
    baseState: State,
    pendingUpdate: Update<State> | null
): { memorizedState: State } => {
    // 两种情况
    // 有更新
    const result: ReturnType<typeof processUpdateQueue<State>> = {
        memorizedState: baseState
    }
    if (pendingUpdate) {
        const action = pendingUpdate.action;
        // 这里实现的就是this.setState(1,() => {})
        if(action instanceof Function) {
            result.memorizedState = action(baseState);
        } else {
            // this.setState
            result.memorizedState = action;
        }
    }
}