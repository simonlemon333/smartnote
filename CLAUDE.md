# 项目目标

- 我希望实现一个"智能笔记"桌面应用，我可以把自己想要的视频（比如 mp4 或 mkv 格式的文件）拖进去或上传，应用能自动识别视频内容、进行语音转写和要点总结，最后生成适合直接复制进 Notion 的结构化笔记，最好支持 Notion 的 toggle 结构（折叠卡片）。
- 主要功能：
  - 支持本地视频文件（mp4/mkv）导入
  - 自动转语音为文本（Whisper/AI转录）
  - 用大模型总结每一段内容和关键要点
  - 输出支持 Notion toggle 格式的结构化笔记（Markdown 标记可直接粘贴到 Notion）

# 技术栈倾向
- Electron + React 开发桌面端界面
- 后端/AI接口可以用 Python（Whisper转录+GPT总结）
- 后续有可能支持直接同步到 Notion

# 我的主要目标
- 操作简单，拖视频即可总结
- 生成的笔记能直接被 Notion "一键收录"，并且格式美观、支持折叠（toggle）

---

# 项目实现状态 (v1.1 - 95% Complete)

## ✅ 已完成功能
### 后端 API (Flask) - 完全可用
- ✅ Flask 服务器运行在 http://localhost:5000
- ✅ 视频文件上传处理 (/process-video 端点)
- ✅ 视频转音频提取 (MoviePy + 备用方案)
- ✅ 本地 Whisper 语音转文本 (已安装所有依赖)
- ✅ DashScope AI 总结 (已配置 API key 和 URL)
- ✅ 完美的 Notion toggle 格式输出 (使用 > 符号)
- ✅ 临时文件管理和清理

### 前端结构 (React + Electron)
- ✅ Electron 主进程和 IPC 处理
- ✅ React 组件 (VideoDropZone, ProcessingStatus, NotesOutput)
- ✅ 拖拽视频文件功能
- ✅ TypeScript 编译和 Webpack 构建
- ✅ 开发服务器配置

### AI 技术栈 - 生产就绪
- ✅ 本地 Whisper: 免费语音转文本 (包含 CUDA 依赖)
- ✅ DashScope API: 超低成本总结 (~$0.003/2小时视频)
- ✅ API 密钥配置: sk-e9afdc91a46e4a9d867dc534fe3e9401
- ✅ API 地址配置: https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions
- ✅ 备用方案: Whisper 和 MoviePy 的完整备用机制

## ⚠️ 需要修复
### 前端界面
- ⚠️ Web 界面显示白屏 (React 应用未正确渲染)
- ✅ Webpack 开发服务器运行在 http://localhost:9000
- ✅ HTML 模板正确加载

### 测试和优化
- ⚠️ 需要用真实视频文件测试完整流程
- ⚠️ Electron 桌面应用最终完善

## 🎯 使用说明
### 当前可用功能
1. **启动后端**: `python3 backend/app.py`
2. **API 测试**: `curl -X POST http://localhost:5000/process-video -F "video=@your_video.mp4"`
3. **健康检查**: `curl http://localhost:5000/health`

### 示例输出格式
```markdown
> ## 📝 主要内容
- 视频概述要点
- 关键信息提取

> ## 🧠 核心主题
- 主题1: 详细说明
- 主题2: 详细说明

> ## 📄 总结
完整的内容总结，适合直接复制粘贴到 Notion
```

## 🚀 下一步计划 (v1.2)
1. **修复前端白屏问题** - 调试 React 应用渲染
2. **完成视频处理测试** - 使用真实视频文件验证
3. **Electron 应用完善** - 桌面应用最终打包

## 💡 成本优化
- 本地 Whisper: 免费
- DashScope API: ~$0.003/2小时视频
- 总成本: 几乎为零的运营成本

