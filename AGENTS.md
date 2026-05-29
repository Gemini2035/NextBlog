# AGENTS.md

## 通用规则

- 使用中文和用户沟通。
- 代码注释默认使用英文。
- 优先遵循现有代码风格，不要引入不必要的新抽象。
- 不要修改与当前任务无关的文件。
- 优先使用项目中已经封装好的方法，不要重复编写

## Frontend

- 使用Typescript写代码，尽量避免使用any类型
- 使用es6风格代码，尽量使用扩展解构代码

## Backend

- 后端代码位于 `apps/backend`。
- API route 保持轻量，只做参数处理、权限检查和调用 service。
- 业务逻辑放在 `apps/backend/app/services`。
- 请求和响应结构放在 `apps/backend/app/schemas`。
- python代码需要符合pylance strict审查标准，符合项目pyrightconfig.json标准
- 接口代码文件结构需要符合项目整体风格
- 修改后端行为后，尽量运行：

```sh
cd apps/backend
python -m pytest