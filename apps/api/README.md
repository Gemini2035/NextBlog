# NextBlog API

Python 后端应用，建议使用 FastAPI 承载业务接口、第三方集成、数据库访问和后台任务。

## 目录

```txt
app/
├── main.py          # 应用入口
├── api/             # HTTP 路由
├── core/            # 配置、环境变量、安全等基础能力
├── integrations/    # GitHub、OpenAI 等第三方服务
├── models/          # 数据库模型
├── repositories/    # 数据访问层
├── schemas/         # 请求/响应结构
└── services/        # 业务逻辑
```

## 本地启动

```bash
uvicorn app.main:app --reload
```
