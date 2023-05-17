import path from 'path';
import fs from 'fs';

// 引入打包需要的两个插件
// 解析ts
import ts from 'rollup-plugin-typescript2';

import cjs from '@rollup/plugin-commonjs';

// ===========resolvePkgPath， getPackageJSON==============
// 这两个方法用解析package.json中的信息，因为打包input需要路径信息
// 包路径
const pkgPath = path.resolve(__dirname, '../../packages');
// 产物路径: 这里因为打包出来的有很多的包，react，react-dom
const distPath = path.resolve(__dirname, '../../dist/node_modules');

/**
 * 解析包路径
 * @param {*} pkgName 包名
 * @param {*} isDist 是否是产物
 * @returns 路径
 */
export function resolvePkgPath(pkgName, isDist) {
	// 产物路径下的包
	if (isDist) {
		return `${distPath}/${pkgName}`;
	}
	// package下的包
	return `${pkgPath}/${pkgName}`;
}

/**
 * 获取package.json文件的内容
 * @param {*} pkgName 包名
 * @returns JSON.parse(str)
 */
export function getPackageJSON(pkgName) {
	// ...包路径
	// 获取到所有包下面的package.json
	const path = `${resolvePkgPath(pkgName)}/package.json`;
	const str = fs.readFileSync(path, { encoding: 'utf-8' });
	return JSON.parse(str);
}

/**
 * 获取rollup配置的基本插件
 * @param {*} param0 配置项
 * @returns 插件数组list
 */
export function getBaseRollupPlugins({ typescript = {} } = {}) {
	return [cjs(), ts(typescript)];
}
