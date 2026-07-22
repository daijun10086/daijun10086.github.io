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
![图片说明](../../assets/blog/my-new-article/figure-1.jpg)

[查看 PDF](../../assets/research/my-project/paper.pdf)
```

Research 顶部的 `links` 使用站点地址：

```yaml
links:
  - label: PDF
    href: "/assets/research/my-project/paper.pdf"
```
