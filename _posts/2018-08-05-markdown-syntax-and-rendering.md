---
title: "Markdown 语法及渲染"
date: 2018-08-12 21:30:23 +0800
category: Markdown
tags: [Markdown, Minimalism]
excerpt: 本文主要说明一些常用的 Markdown 语法及主题 Minimalism 中的渲染效果。
---

## 说明

Jekyll 默认使用 [kramdown] 来渲染 markdown 类型文件，在 Minimalism 主题中也是使用其默认配置，但在其渲染的基础上自定义了自己的样式，主要参考了 GitHub 的渲染风格。

## Markdown 基本语法

:stuck_out_tongue: 可能 Markdown 的基本语法大家都很熟悉了，这里主要还是想展示一下主题对各种格式的渲染效果，况且日常写作中，通常也不会全用得上。

### 1. 斜体和粗体

使用 * 和 ** 表示斜体和粗体。

示例：

```
这是 *斜体*，这是 **粗体**。
```

效果：

这是 *斜体*，这是 **粗体**。

### 2. 分级标题

标题分 6 级，在行首加 `#` 以表示不同级别的标题 (H1-H6)，例如：# H1, ## H2, ### H3，#### H4，常用的标题主要就是 1 ~ 3 级，往后标题基本同加粗的效果差不多了。

示例：

```
# 一级标题

## 二级标题

### 三级标题

#### 四级标题

##### 五级标题

###### 六级标题
```

效果：

# 一级标题

## 二级标题

### 三级标题

#### 四级标题

##### 五级标题

###### 六级标题

### 3. 外链接

使用 \[描述](链接地址) 为文章增加外链接。

示例：

```
这是去往 [主题 Minimalism](https://github.com/showzeng/minimalism) 的链接。
```

效果：

这是去往 [主题 Minimalism](https://github.com/showzeng/minimalism) 的链接。

也可在链接地址后加一个标题，直观效果时鼠标悬停时的文本提示，其语法是链接后加空格和标题文本。

示例：

```
这是去往 [主题 Minimalism](https://github.com/showzeng/minimalism "Minimalism") 的链接。
```

效果 (鼠标悬停在链接上时触发)：

这是去往 [主题 Minimalism](https://github.com/showzeng/minimalism "Minimalism") 的链接。

同时外链接还有另一种使用方式，一般是在文末放置链接标注，在文中就直接使用标注。

示例：

```
文末放置 Minimalism 的链接标注：
[Minimalism]: https://github.com/showzeng/minimalism

文章中直接使用标注替代链接：
这是我开发的一个新主题 [Minimalism]。
```

效果：

这是我开发的一个新主题 [Minimalism]。

此外，在使用链接标注时，可以替换需要显示的链接文本。

示例：

```
文末放置 Minimalism 的链接标注：
[Minimalism]: https://github.com/showzeng/minimalism

文章中直接使用标注替代链接：
这是我开发的一个新主题 [Minimalism Theme][Minimalism]。
```

效果：

这是我开发的一个新主题 [Minimalism Theme][Minimalism]。

### 4. 无序列表

使用 `*` / `-` / `+` 表示无序列表。

示例：

```
* 无序列表项 一
* 无序列表项 二
* 无序列表项 三
```

效果：

* 无序列表项 一
* 无序列表项 二
* 无序列表项 三

### 5. 有序列表

使用数字和点表示有序列表。

示例：

```
1. 有序列表项 一
2. 有序列表项 二
3. 有序列表项 三
```

效果：

1. 有序列表项 一
2. 有序列表项 二
3. 有序列表项 三

### 6. 引用

使用 `>` 表示引用。

示例：

```
> Less is more. —— 「Andrea del Sarto」
```

效果：

> Less is more. —— 「Andrea del Sarto」

当然，引用也可以嵌套使用。

示例：

```
> Less is more. —— 「Andrea del Sarto」
>> 万物之始，大道至简，衍化至繁。 —— 『道德经』
```

效果：

> Less is more. —— 「Andrea del Sarto」
>> 万物之始，大道至简，衍化至繁。 —— 『道德经』

### 7. 行内代码块

使用 \`代码\` 表示行内代码块。

示例：

```
让主题 `Minimalism` 成为行内代码块。
```

效果：

让主题 `Minimalism` 成为行内代码块。

### 8. 代码块

使用四个缩进空格表示代码块。

示例：

```
    这是一个代码块，此行左侧有四个不可见的空格。
```

效果：

    这是一个代码块，此行左侧有四个不可见的空格。

需要指出的是，我并不喜欢和推荐用这种格式来书写，其实这个代码块在主题中就是没有指定代码类型默认的代码块样式 (而指定代码类型使用的是 [Prism] 官网定制的代码渲染主题，你也可以制作你自己的代码渲染主题并替换博客主题的代码渲染主题，具体请参考博客主题定制文章。)，所以，当你想实现一个代码块效果时，推荐如下用法。

示例：

<pre class="highlight">
  <code>
  ```
  这是一个代码块。
  ```

  ```text
  指定代码类型的代码块。
  ```

  ```java
  public class HelloWorld {

      public static void main(String[] args) {
          // Prints "Hello, World" to the terminal window.
          System.out.println("Hello, World");
      }

  }
  ```
  </code>
</pre>

效果：

```
这是一个代码块。
```

``` text
指定代码类型的代码块。
```

```java
public class HelloWorld {

    public static void main(String[] args) {
        // Prints "Hello, World" to the terminal window.
        System.out.println("Hello, World");
    }

}
```

### 9. 插入图像

使用 \!\[描述](图片链接地址) 插入图像。

示例：

```
![头像](https://www.z4a.net/images/2017/08/31/shortcut_icon.png)
```

效果：

![头像](https://www.z4a.net/images/2017/08/31/shortcut_icon.png)

同外链接，图片也可在链接地址后加一个标题，直观效果时鼠标悬停时的文本提示，其语法是链接后加空格和标题文本。

示例：

```
![头像](https://www.z4a.net/images/2017/08/31/shortcut_icon.png "头像")
```

效果 (鼠标悬停在头像上时触发)：

![头像](https://www.z4a.net/images/2017/08/31/shortcut_icon.png "头像")

### 10. 分隔符

使用 `---` 可显示分隔符。

示例：

```
---
```

效果：

---

### 11. 反转义

使用 `\` 可使 Markdown 解析时不会去解析本该属于语法部分的一些符号。

示例：

```
\`代码块\`
```

效果：

\`代码块\`

### 12. Emoji

主题同样也支持 Emoji 表情，使用方法很简单。

示例：

```
(Smile) :smile: (Sob) :sob:
```

效果：

(Smile) :smile: (Sob) :sob:

Emoji 的代码参考 [Emoji sheet]。

### 13. 段内换行

在同一段落里让文本换行，只需在上一行末尾加 2 个空格即可。

示例：

```
这是这个段落的第一行。  
这是同一个段落的第二行。
```

效果：

这是这个段落的第一行。  
这是同一个段落的第二行。

## Markdown 高阶语法

### 1. 删除线

使用 `~~` 表示删除线。

示例：

```
~~这是一段错误的文本。~~
```

效果：

~~这是一段错误的文本。~~

### 2. 注脚

使用 [^keyword] 表示注脚。

示例：

```
这是第一个注脚 [^footnote1] 的样例。

这是第二个注脚 [^footnote2] 的样例。

对应在文章末尾放置如下，点击效果中的注脚即可跳转至文章末尾的注脚注解。

[^footnote1]: 这是第一个注脚的注解。
[^footnote2]: 这是第二个注脚的注解。
```

效果：

这是第一个注脚 [^footnote1] 的样例。

这是第二个注脚 [^footnote2] 的样例。

### 3. 加强的代码块

使用 [Prism] 官网定制的代码高亮主题，选择了所有支持的编程语言，你可以定制你自己的语法主题。

非代码示例：

<pre class="highlight">
<code>
```
$ sudo pacman -S oh-my-zsh-git
```
</code>
</pre>

效果：

```
$ sudo pacman -S oh-my-zsh-git
```

Python 示例：

<pre class="highlight">
<code>
```python
@requires_authorization
def somefunc(param1='', param2=0):
    '''A docstring'''
    if param1 > param2: # interesting
        print 'Greater'
    return (param2 - param1 + 1) or None

class SomeClass:
    pass

>>> message = '''interpreter
... prompt'''
```
</code>
</pre>

效果：

```python
@requires_authorization
def somefunc(param1='', param2=0):
    '''A docstring'''
    if param1 > param2: # interesting
        print 'Greater'
    return (param2 - param1 + 1) or None

class SomeClass:
    pass

>>> message = '''interpreter
... prompt'''
```

JavaScript 示例：

<pre class="highlight">
<code>
``` javascript
/**
* nth element in the fibonacci series.
* @param n >= 0
* @return the nth element, >= 0.
*/
function fib(n) {
  var a = 1, b = 1;
  var tmp;
  while (--n >= 0) {
    tmp = a;
    a += b;
    b = tmp;
  }
  return a;
}

document.write(fib(10));
```
</code>
</pre>

效果：

```javascript
/**
* nth element in the fibonacci series.
* @param n >= 0
* @return the nth element, >= 0.
*/
function fib(n) {
  var a = 1, b = 1;
  var tmp;
  while (--n >= 0) {
    tmp = a;
    a += b;
    b = tmp;
  }
  return a;
}

document.write(fib(10));
```

### 4. 表格支持

示例：

```
| 项目 | 价格 | 数量 |
| -- | -- | -- |
| 计算机 | \$1600 | 5 |
| 手机 | \$12 | 12 |
| 管线 | \$1 | 234 |
```

效果：

| 项目 | 价格 | 数量 |
| -- | -- | -- |
| 计算机 | \$1600 | 5 |
| 手机 | \$12 | 12 |
| 管线 | \$1 | 234 |

表格中的项默认都是左对齐，使用 `:--:` 和 `--:` 可设置居中和右对齐。

示例：

```
| 项目 | 价格 | 数量 |
| -- | :--: | --: |
| 计算机 | \$1600 | 5 |
| 手机 | \$12 | 12 |
| 管线 | \$1 | 234 |
```

效果：

| 项目 | 价格 | 数量 |
| -- | :--: | --: |
| 计算机 | \$1600 | 5 |
| 手机 | \$12 | 12 |
| 管线 | \$1 | 234 |

### 5. 定义型列表

示例：

```
名词 1
: 定义 1（左侧有一个可见的冒号和空格）

名词 2
: 定义 2（左侧有一个可见的冒号和空格）
```

效果：

名词 1
: 定义 1（左侧有一个可见的冒号和空格）

名词 2
: 定义 2（左侧有一个可见的冒号和空格）

### 6. Html 标签

可在 Markdown 语法中直接嵌套 Html 标签，譬如，你可以用 Html 写一个纵跨两行的表格：

示例：

```
<table>
    <tr>
        <th rowspan="2">值班人员</th>
        <th>星期一</th>
        <th>星期二</th>
        <th>星期三</th>
    </tr>
    <tr>
        <td>李强</td>
        <td>张明</td>
        <td>王平</td>
    </tr>
</table>
```

效果：

<table>
    <tr>
        <th rowspan="2">值班人员</th>
        <th>星期一</th>
        <th>星期二</th>
        <th>星期三</th>
    </tr>
    <tr>
        <td>李强</td>
        <td>张明</td>
        <td>王平</td>
    </tr>
</table>

### 7. 待办事项 Todo 列表

使用带有 `[ ]` 或 `[x]` (未完成或已完成) 项的列表语法撰写一个待办事项列表，并且支持子列表嵌套以及混用Markdown语法。

示例：

```
- [x] **博客改版**
    - [x] 响应式布局，移动端适配
    - [ ] 多语言支持
    - [x] 主页
    - [x] 文章列表页
    - [x] 归档页
    - [x] 关于页
    - [x] 文章详情页
        - [x] 排版
        - [x] Markdown 渲染
        - [x] 代码高亮，使用 [Prism](https://prismjs.com/)
        - [ ] Toc 功能
        - [x] 评论功能
        - [x] 打赏功能

- [x] **Minimalism 主题发布**
    - [x] 主题编写
    - [x] 打包发布
```

效果：

- [x] **博客改版**
    - [x] 响应式布局，移动端适配
    - [ ] 多语言支持
    - [x] 主页
    - [x] 文章列表页
    - [x] 归档页
    - [x] 关于页
    - [x] 文章详情页
        - [x] 排版
        - [x] Markdown 渲染
        - [x] 代码高亮，使用 [Prism](https://prismjs.com/)
        - [ ] Toc 功能
        - [x] 评论功能
        - [x] 打赏功能

- [x] **Minimalism 主题发布**
    - [x] 主题编写
    - [x] 打包发布

## 写在最后

本篇博客列举的语法模板部分参考了 [Cmd Markdown 编辑阅读器的语法说明] :+1:，感谢。

---

[^footnote1]: 这是第一个注脚的注解。
[^footnote2]: 这是第二个注脚的注解。

[Minimalism]: https://github.com/showzeng/minimalism
[kramdown]: https://github.com/gettalong/kramdown
[Prism]: https://prismjs.com/
[Emoji sheet]: https://www.webfx.com/tools/emoji-cheat-sheet/
[Cmd Markdown 编辑阅读器的语法说明]: https://www.zybuluo.com/mdeditor?url=https%3A%2F%2Fwww.zybuluo.com%2Fstatic%2Feditor%2Fmd-help.markdown
