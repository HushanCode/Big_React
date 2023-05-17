import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols';

// ReactElement
REACT_ELEMENT_TYPE;
const ReactElement = function (type, key, ref, props) {
	const element = {
		$$typeof: REACT_ELEMENT_TYPE,
		key,
		ref,
		props,
		__mask: 'zhuling'
	};
	return element;
};
