# 通过[`yarn`](https://yarnpkg.com/features/workspaces)与[`lerna`](https://github.com/lerna/lerna)来实施 monorepo 策略

### `yarn` 能做什么

- 规范化 repo 结构

- 依赖管理，帮助你更好的简化依赖安装

  - 通过`yarn`指令安装所有依赖项

  - 通过`yarn workspace <command>`来针对各个 project 执行指令

- 其他功能：跨 project 的 scripts 调用

### `lerna` 能做什么

- 针对每个 project 的独立版本控制

  ```javascript
  // lerna.json
  {
  "npmClient": "yarn",
  // 声明独立的版本控制
  "version": "independent"
  }
  ```

### step by step 实现

1. 创建远程 repo，并关联本地文件夹

> 如果你用 `yarn2`，只需要执行`yarn init --workspace`即可替代 2，3，4 步骤

2. 在文件夹中执行`yarn init`

3. 修改生成的 package.json 文件

```json
{
  "private": true,
  "workspaces": {
    "packages": ["packages/*"]
  }
}
```

4. 新建一个 packages 文件夹，将所有的 project 放在里面即可

5. 提交配置到远程仓库
