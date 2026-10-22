# 布依风物志

贵州布依族民俗文化数字博物馆网站。以 `页面大纲.docx` 的章节结构和配图为基础，通过明亮的编辑式视觉、图像裁切与互动模块，介绍蓝染、布依戏、古歌、节令、饮食与地域文化。

## 本地运行

环境要求：Node.js 22+、pnpm 11+。

```bash
pnpm install
pnpm dev
```

生产构建：

```bash
pnpm typecheck
pnpm test
pnpm build
pnpm preview
```

浏览器交互测试：

```bash
pnpm exec playwright install chrome
pnpm test:e2e
```

如果本机已安装 Chrome，也可以设置 `PLAYWRIGHT_CHANNEL=chrome` 后运行 `pnpm test:e2e`。

## 页面结构

网站使用 React Router 的 Hash 路由，兼容 GitHub Pages 的项目子路径：

- 首页与三大板块入口
- 蓝染工坊：蜡染工序、纹样图鉴、传统服饰、纹样拼贴
- 古寨戏台：八音坐唱、布依戏、古歌与传说、查白歌节
- 节令风物：六月六、饮食文化、婚恋习俗、文化地理
- 布依文创与版权声明

## 资源

- `public/images/`：由文档配图转换和裁切得到的 WebP 展示图片
- `source-assets/images/original/`：从文档提取的原始图片
- `public/audio/theme.mp3`：项目方提供的背景音乐
- `src/assets/fonts/`：网站展示字体

脚本 `scripts/prepare-assets.mjs` 可在原始图片更新后重新生成 WebP 图片。

## GitHub Pages

仓库推送到 GitHub 后，在仓库 Settings → Pages 中将 Source 设为 **GitHub Actions**。推送 `main` 分支会触发 `.github/workflows/deploy.yml`，自动测试、构建并部署 `dist`。

当前项目已初始化为可在任意仓库子路径部署的静态站点，没有提交远程仓库地址。
