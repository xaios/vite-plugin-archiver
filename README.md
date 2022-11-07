# 功能介绍

开发这个插件之前搜了一轮，原来我并不是第一个需要这个功能的，但一轮看下来，都只是一些简单的结果打包，满足不了一些比较复杂跟常见的情况。

所以还是决定开发一个插件来完成 Vite 构建结果打包任务，同时还兼顾了源码打包、压缩包密码等场景。

# vite.config.js 配置

```javascript
import Archiver from '@xaios/vite-plugin-archiver'

// 可以单纯传入一个字符串作为项目名，其余配置取默认值：const CONFIG_ARCHIVE = 'project'
// 下列配置如无特殊说明，均为默认值
const CONFIG_ARCHIVE = {
  dist: 'dist',              // 构建结果目录
  name: 'name',              // 项目名，打包文件名会用到，不存在默认值
  open: true,                // 完成打包后是否打开项目目录，只在 Windows 下有效
  origin: true,              // 是否打包源码，可设置为 false 或一个字符串，当值为字符串时，作为源码压缩包的密码
  format: 'MMddhhmm',        // 时间后缀格式，可替换内容包含：yyyy MM dd hh mm ss
  password: '',              // 构建结果压缩包密码，为空则不设置
  origin_pre: 'origin',      // 源码打包结果前缀
  result_pre: 'result',      // 构建结果打包前缀
  ignore_folder: [],         // 源码打包时忽略的目录，固定忽略 node_modules 与构建结果目录，以及 .git 目录
  ignore_file: ['*.zip']     // 源码打包时忽略的文件
}

export default {
  plugins: [Archiver(CONFIG_ARCHIVE)]
}

// 构建结果打包文件名格式为：`result_${name}_${format}.zip`
// 源码打包结果文件名格式为：`origin_${name}_${format}.zip`
// format 为空时无 `_${format}` 部分
```

# 环境说明

插件基于 Vite3 + Node.js 16.16.0 开发，但应该不存在 Node.js 版本向上兼容的问题，更高的版本应该都可以用。

虽然没有使用 Vite3 特有的插件钩子，但控制了仅在构建时调用插件，所以应该也算是 Vite 专供插件。
