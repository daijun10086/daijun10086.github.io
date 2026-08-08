# Writing content

每篇文章都是一个独立的 Markdown 文件：

- Blog 放在 `content/blog/`
- Research 放在 `content/research/`

新增文章时，复制对应目录里的 `_template.md`，再将副本改成新的文件名，例如：

```text
content/blog/my-new-article.md
```

文件名会自动成为文章网址的一部分，因此请使用不重复的小写英文单词，并用连字符连接。文件开头的 `date` 决定列表顺序，最新日期会自动排在最前面。

运行开发、测试或构建命令时，网站会自动扫描这两个目录并更新文章索引，不需要手动维护总列表。以下划线开头的模板文件不会被发布。

## 图片和 PDF

文章使用的本地资源放在 `public/assets/`，按照内容类型和文章文件名分组：

```text
public/assets/
├── blog/
│   └── my-new-article/
│       └── figure-1.jpg
└── research/
    └── my-project/
        └── paper.pdf
```

在 Markdown 正文中使用相对地址：

```md
![图片说明](../../public/assets/blog/my-new-article/figure-1.jpg)

[查看 PDF](../../public/assets/research/my-project/paper.pdf)
```

这个路径对应 Markdown 文件在本地的真实位置，因此编辑器可以直接预览。网站渲染文章时会自动移除路径中的 `public/`，同一写法也可以正常部署到 GitHub Pages。

Research 顶部的 `links` 使用站点地址：

```yaml
links:
  - label: PDF
    href: "/assets/research/my-project/paper.pdf"
```

## Aisthesis 资源

Aisthesis 和 Blog、Research 使用相同的“一条内容 = 一个 Markdown 文件”结构。资源文件放在：

```text
content/aisthesis/
```

新增资源时，复制 `content/aisthesis/_template.md`，并将副本改成小写英文文件名，例如：

```text
content/aisthesis/my-favorite-resource.md
```

每个资源文件的格式如下：

```md
---
title: "Resource Name"
href: "https://example.com"
category: "Photography"
date: "2026-08-08"
preview: "https://example.com/preview.jpg"
---

Write a short note about this resource and why you like it.
```

- `title`：页面上显示的资源名称。
- `href`：点击标题后打开的外部链接，必须以 `http://` 或 `https://` 开头。
- `category`：显示在左侧的资源类别，例如 Photography、Film 或 Rendering。
- `date`：添加日期，使用 `YYYY-MM-DD`；较新的资源自动排在前面。
- `preview`：可选的网站预览图片地址；可以使用网站的 Open Graph 图片或站内 `/assets/` 图片。
- 正文：你对这个资源的简短介绍或喜欢它的原因。

构建网站时会自动扫描该目录。Aisthesis 只把资源汇总成列表，不会为每条资源生成站内详情页。
填写 `preview` 时会显示类似 Notion bookmark 的预览卡；省略该字段时则显示纯文字卡片。
