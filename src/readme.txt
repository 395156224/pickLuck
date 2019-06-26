4、src文件夹
我们需要在src文件夹中开发代码，打包时webpack会根据build中的规则（build规则依赖于config中的配置）将src打包压缩到dist文件夹在浏览器中运行

（1）assets文件：用于存放静态资源（css、image），assets打包时路径会经过webpack中的file-loader编译（因此，assets需要使用绝对路径）成js

（2）components文件夹：用来存放 .vue 组件(实现复用等功能，如：过滤器，列表项等)

（3）router文件夹：在router/index.js文件中配置页面路由

（4）App.vue：是整个项目的主组件，所有页面都是通过使用<router-view/>开放入口在App.vue下进行切换的（所有的路由都是App.vue的子组件）

（5）main.js：入口js文件（全局js，你可以在这里：初始化vue实例、require/import需要的插件、注入router路由、引入store状态管理）

5、static文件夹：
webpack默认存放静态资源（css、image）的文件夹，与assets不同的是：static在打包时会直接复制一个同名文件夹到dist文件夹里（不会经过编译，可使用相对路径）

6、其他文件：
（1）.babelrc：浏览器解析的兼容配置，该文件主要是对预设（presets）和插件（plugins）进行配置，因此不同的转译器作用不同的配置项，大致可分为：语法转义器、补丁转义器、sx和flow插件

（2）.editorconfig：用于配置代码格式（配合代码检查工具使用，如：ESLint，团队开发时可统一代码风格），这里配置的代码规范规则优先级高于编辑器默认的代码格式化规则 。

（3）.gitignore：配置git提交时需要忽略的文件

（4）postcssrc.js： autoprefixer（自动补全css样式的浏览器前缀）；postcss-import（@import引入语法）、CSS Modules（规定样式作用域）

（5）index.html：项目入口页面，编译之后所有代码将插入到这来

（6）package.json：npm的配置文件（npm install根据package.json下载对应版本的安装包）

（7）package.lock.json：npm install（安装）时锁定各包的版本号

（8）README.md：项目使用说明