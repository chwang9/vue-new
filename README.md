# scaffold-antdv-vue2.x-js

## 环境准备

### 设置 NPM 源

```
npm config set registry https://artifacts.iflytek.com/artifactory/api/npm/npm-repo
```

### 安装依赖

```
npm install
```

### 启动

```
npm run serve
```

### 构建

```
npm run build
```

## 模式和规范

### 目录

```
scaffold-antdv-vue2.x-js/
├─public/
├─src/
│  └─assets/
│  └─components/
│  └─mock/
│  └─pages/
│  └─router/
│  └─services/
│  └─store/
│  └─styles/
│  └─utils/
├─package.json
├─vue.config.js
```

### packgae.json

除 serve, build, lint 外，额外提供了 mock 和 update:antd 两个脚本

```json
"scripts": {
    "serve": "vue-cli-service serve",
    "mock": "cross-env MOCK=true npm run serve",
    "build": "vue-cli-service build",
    "lint": "vue-cli-service lint",
    "update:antd": "node ./update/updateAntd"
  }
```

- mock: 详见 [src/mock/](##src/mock/) 段落

- update:antd: 升级 ui 框架 ant-design-vue

  - 何时使用？新版本修复了你 focus 的 bug 或引入了你需要的新特性

  - **除 ui 框架外，不建议主动升级其他依赖**

### vue.config.js

```js
module.exports = {
  publicPath: "/",
  devServer: {
    // proxy: "http://10.3.171.152:8081"
  },
```

- 不要指定 publicPath 为空字符串 '' 或相对路径 './'，若你的 dist 被部署在一个根路径上，publicPath 指定为 "/"；若你的 dist 被部署在一个子路径上，publicPath 指定为 "/\${子路径名称}"

  > history 路由，详见 [src/router/](##src/router/) 段落

- 在 serve 环境下，通过配置 proxy 将 API 请求代理到服务器

### public/

public 目录下的文件会在 build 时被 copy 到 dist 目录

### src/assets/

静态资源目录

- fonts

  - 何时使用？某些场景下标题需要特殊字体

  - **尽量不要使用字体图标，使用 svg 代替**

- icons

  - 何时使用？图标

  - **所有图标都使用 svg 格式，不使用 png/jpg 格式**

  - 代码演示

    ```js
    <template>
      <div>
        <a-icon :component="MessageSvg" :style="{color:'red',fontSize:'20px'}"/>
      </div>
    </template>

    <script>
    import MessageSvg from '@/assets/icons/message.svg'
    export default {
      data() {
        return {
          MessageSvg
        };
      }
    };
    </script>
    ```

    > 详情参考 ant-design-vue 官网 - Icon 图标 - 自定义 SVG 图标

- images

  - 何时使用？背景、插图

  - 代码演示

    ```js
    <template>
      <div>
        <img :src="noFound" />
      </div>
    </template>

    <script>
    export default {
      data() {
        return {
          noFound: require("@/assets/images/404.png")
        };
      }
    };
    </script>
    ```

    > require, require, require 重要的事情说三遍

### src/components/

项目相关的 Vue 组件，便于重用

### src/mock/

/mock 目录下的所有 js 文件都会被自动解析为 mock 文件（除 index.js 外）

比如，api.js 和 user.js 会被解析为 mock 文件

```
├─mock/
│  └─api.js
│  └─user/
│    └─user.js
```

编写 mock 文件格式如下

```js
export default {
  "/api": {
    id: 1
  },
  "/user/api": {
    code: 2
  }
};
```

**如何启动 Mock？使用 npm run mock 代替 npm run serve**

### src/pages/

页面

### src/router/

路由配置

- 请始终使用 history 路由

  - 接入微前端的必备条件

- 请始终使用懒加载，component: () => import("...")

- 请始终保持

  ```js
  {
    path: "*",
    component: () => import("@/pages/404"),
    meta: { title: "404" }
  }
  ```

  在最后。

- 定义路由的时候可以配置 meta 字段

  ```js
  {
    meta: {
      // 配置路由的标题
      title: "测试",
      // 配置路由是否需要缓存
      keepAlive: true,
      // 配置路由权限
      requiresAuth: true
      // 等
    }
  }
  ```

  src/router/authority.js 提供了一个实现路由标题的 sample，可以直接使用，也可以修改如下

  ```js
  router.beforeEach((to, from, next) => {
    // 添加项目名称
    to.meta && typeof to.meta.title !== "undefined"
      ? (document.title = `${项目名称} - ${to.meta.title}`)
      : "";

    next();
  });
  ```

  缓存、权限等功能需根据项目特性自行考虑

### src/services/

和服务端进行交互

一个完整的前端 UI 和服务端进行交互的处理流程是这样的：

1. UI 组件交互

2. 调用统一管理的 api service 请求函数

3. 利用封装的 request.js 发送请求

4. 获取服务端返回

5. 更新 data

从上面的流程可以看出，统一的请求处理都放在 src/services/ 目录下，一般按照 Controller 进行文件拆分，比如

```
├─services/
│  └─alarm.js
│  └─common.js
│  └─user.js
```

一个 sample

```js
import request from "@/utils/request";

export async function api() {
  return request("/api");
}
```

其中，/utils/request 是基于 axios 的封装，详细请看 request.js

request() 请求的参数同 axios，例如

```js
{
  // `url` 是用于请求的服务器 URL
  url: '/user',
  // `method` 是创建请求时使用的方法，默认是 get
  method: 'get',
  // `baseURL` 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL
  baseURL: 'https://some-domain.com/api/',
  // `headers` 是即将被发送的自定义请求头
  headers: {'X-Requested-With': 'XMLHttpRequest'},
  // `params` 是即将与请求一起发送的 URL 参数
  params: { ID: 12345 },
  // `data` 是作为请求主体被发送的数据，只用于 'PUT', 'POST', 和 'PATCH'
  data: { firstName: 'Fred' },
  // 等
}
```

调用 api

```js
// template

<script>
import { api } from "@/services/sample.js";

export default {
  mounted() {
    api().then(res => {
      console.log(res);
    });
  }
};
</script>
```

### src/store/

状态管理模式

将 vuex 的相关代码分割到模块（./modules/）中，每个模块都有自己的 state、mutation、action 和 getter，使用时，通过添加 namespaced: true 的方式使其成为带命名空间的模块。例如：

```js
const state = {};

const getters = {};

const mutations = {};
Object.keys(state).forEach(item => {
  mutations[item] = (state, value) => {
    state[item] = value;
  };
});

const actions = {};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
```

需要注意的是

- 提交 mutation 是更改 state 的唯一方法

  - 框架封装了一个简单的函数，自动生成 state 同名的 mutation

  ```js
  const mutations = {};
  Object.keys(state).forEach(item => {
    mutations[item] = (state, value) => {
      state[item] = value;
    };
  });
  ```

  一个 sample

  ```js
  const state = {
    username: ""
  };

  // 不需要手写 mutation
  const mutations = {};
  Object.keys(state).forEach(item => {
    mutations[item] = (state, value) => {
      state[item] = value;
    };
  });

  const actions = {
    login({ state, commit }, username) {
      // never
      // state.username = username;

      // good
      commit("username", username);
    }
  };

  export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
  };
  ```

- 默认使用 vuex-persistedstate 插件使 vuex 状态持久化，若需求冲突，可以去掉

  > 什么是状态持久化？F5 刷新页面的时候，vuex 不会被清空

  ```js
  import Vue from "vue";
  import Vuex from "vuex";
  import createPersistedState from "vuex-persistedstate";
  import cache from "./modules/cache";

  Vue.use(Vuex);

  export default new Vuex.Store({
    modules: {
      cache
    },
    plugins: [
      createPersistedState({
        storage: window.sessionStorage
      })
    ]
  });
  ```

### src/styles/

样式控制

- 使用 less 管理样式表

  ```
  ├─styles/
  │  └─global.less
  │  └─token.less
  │  └─variables.less
  ```

- 样式表之间是如何管理的？

  - src/main.js 引用 global.less

  - global.less 引用 variables.less

  - variables.less 引用 token.less

- global.less

  - 全局样式

- token.less

  - 定制主题，修改 ui 框架 ant-design-vue 的默认主题

  ```less
  // 默认主题
  @blue-6: #2e71e6;
  @green-6: #26bd58;
  @gold-6: #fa9119;
  @red-6: #f03a4c;
  ```

  > 详情参考 ant-design-vue 官网 - 定制主题 - 配置 less 变量文件

  - **请不要在 token.less 中定义非 ui 框架的变量，若需要自定义 css 变量，在 variables.less :root{} 中编写**

- variables.less

  - 自定义 css 变量

  - 换肤必备

    - 使用 css 变量实现换肤

    一个 sample

    ```less
    :root {
      --min-width: 1600px;
      --min-height: 900px;
      --color-primary: #2e71e6;
    }

    [data-theme="purple"] {
      --color-primary: #8a52e5;
    }

    [data-theme="green"] {
      --color-primary: #26bd58;
    }

    [data-theme="gold"] {
      --color-primary: #fa9119;
    }

    [data-theme="red"] {
      --color-primary: #f03a4c;
    }
    ```

    > Why & How?
    >
    > - :root 是一个伪类，匹配文档根元素，只要 page 引用了 :root 所在的文件，就可以使用 css var() 来引用变量
    >
    > - [data-theme="xxx"] 会覆盖 :root 里面的同名变量
    >
    > - 使用 js 改变 data-theme
    >
    > ```
    > changeTheme(name) {
    >   document.documentElement.setAttribute("data-theme", name);
    > }
    > ```

- 各 page 的样式表在 .vue 文件内控制，不要重复定义 css / less 变量，你可以 import variables.less

```js
  // template
  // script

  <style lang="less" scoped>
  @import "@/styles/variables.less";
  .message {
    // variables
    font-size: var(--fontSize);
    // token
    color: @red-6;
  }
  </style>
```

### src/utils/

工具集
