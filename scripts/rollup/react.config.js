import { getPackageJSON, resolvePkgPath, getBaseRollupPlugins } from './utils';
import generatePackageJson from 'rollup-plugin-generate-package-json';
const { name, module } = getPackageJSON('react');
// react包的路径
const pkgPath = resolvePkgPath(name);
// react产物路径
const pkgDistPath = resolvePkgPath(name, true);
export default [
	// react
	{
		// 入口
		input: `${pkgPath}/${module}`,
		// 出口
		output: {
			file: `${pkgDistPath}/index.js`,
			name: 'index.js',
			// 模块类型: 兼容es module 和commonJs的
			format: 'umd'
		},
		// 插件
		plugins: [
			...getBaseRollupPlugins(),
			generatePackageJson({
				// 输入目录
				inputFolder: pkgPath,
				// 输出目录
				outputFolder: pkgDistPath,
				// 自定义package.json的一些字段, 无需将整个package.json复制过去，我们不需要打包后的文件中存在shared
				baseContents: ({ name, description, version }) => ({
					name,
					description,
					version,
					// umd支持commonJs,所以这里我们用main
					main: 'index.js'
				})
			})
		]
	},
	// jsx-runtime
	{
		input: `${pkgPath}/src/jsx.ts`,
		output: [
			// jsx-runtime
			{
				file: `${pkgDistPath}/jsx-runtime.js`,
				name: 'jsx-runtime.js',
				format: 'umd'
			},
			// jsx-dev-runtime
			{
				file: `${pkgDistPath}/jsx-dev-runtime.js`,
				name: 'jsx-dev-runtime.js',
				format: 'umd'
			}
		],
		plugins: getBaseRollupPlugins()
	}
];
