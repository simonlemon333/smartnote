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


# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.

# 文件写入规则
- 由于写入 .md 文件会导致 Claude Code 崩溃，请始终使用 .txt 文件格式
- 用户会手动将 .txt 文件重命名为 .md 格式
- 这个规则适用于所有 markdown 内容的输出