/* eslint-disable prettier/prettier */
// fiber节点的类型
export type WorkTag =
    | typeof FunctionComponent
    | typeof HostRoot
    | typeof HostComponent
    | typeof HostText;
/** 函数组件 */
export const FunctionComponent = 0;
/** React.render(<App/>, root) */
export const HostRoot = 3;
/** 标签 */
export const HostComponent = 5;
/** 文本 */
export const HostText = 6;
