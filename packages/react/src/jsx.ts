import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols';
import {
	ElementType,
	Key,
	Props,
	ReactElementType,
	Ref,
	Type
} from 'shared/ReactTypes';

// ReactElement: 构造函数的实现
const ReactElement = function (
	type: Type,
	key: Key,
	ref: Ref,
	props: Props
): ReactElementType {
	const element = {
		$$typeof: REACT_ELEMENT_TYPE,
		type,
		key,
		ref,
		props,
		__mark: 'zhuling'
	};
	return element;
};

export const jsx = (type: ElementType, config: any, ...maybeChildren: any) => {
	let key: Key = null;
	const props: Props = {};
	let ref: Ref = null;
	// 遍历config处理key，ref
	for (const prop in config) {
		const val = config[prop];
		// 处理key
		if (prop === 'key') {
			// 处理为字符串
			if (val !== undefined) {
				key = '' + val;
			}
			continue;
		}
		// 处理ref
		if (prop === 'ref') {
			if (val !== undefined) {
				ref = val;
			}
			continue;
		}
		// 对于其他的属性需要判断是否是config自己的property,而不是原型上的
		if ({}.hasOwnProperty.call(config, prop)) {
			// 如果是自己的属性，赋值给props,不是就不赋值
			props[prop] = val;
		}
	}

	// 处理children: 这里看出了children，可能是ReactElement，或者数组
	const maybeChildrenLength = maybeChildren.length;
	// 如果长度大于0，那么证明是有多余的children
	if (maybeChildrenLength) {
		// 两种情况：length = 1, length > 1
		if (maybeChildrenLength === 1) {
			props.children = maybeChildren[0];
		} else {
			props.children = maybeChildren;
		}
	}

	return ReactElement(type, key, ref, props);
};

// 实际在react中开发环境和生产环境是不同的实现
export const jsxDEV = jsx;
