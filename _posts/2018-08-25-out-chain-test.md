---
title: 外链测试
date:  2018-08-25 11:49:33 +0800
category: Minimalism
tags: test
excerpt: 各种外链的样式测试，本篇页面较多音视频资源加载，有的也需要科学上网。
---

在博客中有时候我们会想要插入一些外链来丰富博客的内容，比如音乐、视频等，这篇博客尽可能多地加入和测试这些外链，并优化其在博客中的样式及排版。

## 音乐

### 网易云音乐

<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width="330" height="86" src="//music.163.com/outchain/player?type=2&id=4340800&auto=1&height=66"></iframe>

但需要注意的是，生成的外链代码粘贴到文章里时，需要为宽高的数值加上引号，不然解析时会被当成文本处理，如下：

```html
<!-- before -->
<iframe frameborder="no" border="0" marginwidth="0"
 marginheight="0" width=330 height=86
  src="//music.163.com/outchain/player?type=2&id=4340800&auto=1&height=66">
</iframe>

<!-- after -->
<iframe frameborder="no" border="0" marginwidth="0"
 marginheight="0" width="330" height="86"
 src="//music.163.com/outchain/player?type=2&id=4340800&auto=1&height=66">
</iframe>
```

当然，你会发现很多歌曲因为版权保护无法生成外链，其实想要引用，办法还是有的，但是因为涉及版权问题，这里就不讨论了，自己研究去吧 :p

## 视频

### Youtube

<iframe width="560" height="315" src="https://www.youtube.com/embed/7c05xbo6lzY?rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

Youtube 的嵌入代码直接使用就可以了 (当然，前提是需要科学上网 :unamused:)。

### 优酷视频

<iframe height="498" width="100%" src='https://player.youku.com/embed/XMzA0MTU5MzQ1Ng==' frameborder="0" allowfullscreen></iframe>

通过 iframe 引入时，同样需要修改一下格式，例如加上引号等 (如果觉得太小，可以给视频类的宽度设为 100%)，如下：

```html
<!-- before -->
<iframe height=498 width=510
 src='https://player.youku.com/embed/XMzA0MTU5MzQ1Ng=='
 frameborder=0 'allowfullscreen'></iframe>

<!-- after -->
<iframe height="498" width="100%"
 src='https://player.youku.com/embed/XMzA0MTU5MzQ1Ng=='
 frameborder="0" allowfullscreen></iframe>
```

如果是通过 embed 引入的，需要浏览器启用 flash，同时去掉闭合标签及设置宽度等，如下：

```html
<!-- before -->
<embed src='https://player.youku.com/player.php/sid/XMzA0MTU5MzQ1Ng==/v.swf'
 allowFullScreen='true' quality='high'
 width='480' height='400' align='middle'
 allowScriptAccess='always' type='application/x-shockwave-flash'></embed>

<!-- after -->
<embed src='https://player.youku.com/player.php/sid/XMzA0MTU5MzQ1Ng==/v.swf'
 allowFullScreen='true' quality='high'
 width='100%' height='400' align='middle'
 allowScriptAccess='always' type='application/x-shockwave-flash'>
```

### 腾讯视频

<iframe frameborder="0" width="100%" height="498" src="https://v.qq.com/iframe/player.html?vid=p03251eyz0k&tiny=0&auto=0" allowfullscreen></iframe>

使用方法和上面是一样的，如下：

```html
<!-- before -->
<iframe frameborder="0" width="640" height="498"
 src="https://v.qq.com/iframe/player.html?vid=p03251eyz0k&tiny=0&auto=0"
 allowfullscreen></iframe>

<!-- after -->
<iframe frameborder="0" width="100%" height="498"
 src="https://v.qq.com/iframe/player.html?vid=p03251eyz0k&tiny=0&auto=0"
 allowfullscreen></iframe>
```

### bilibili

<iframe width="100%" height="498" src="//player.bilibili.com/player.html?aid=19388000&cid=31616791&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>

B 站的嵌入代码可以给它加个宽高，不至于那么小，如下：

```html
<!-- before -->
<iframe src="//player.bilibili.com/player.html?aid=19388000&cid=31616791&page=1"
 scrolling="no" border="0" frameborder="no"
 framespacing="0" allowfullscreen="true">
</iframe>

<!-- after -->
<iframe width="100%" height="498"
 src="//player.bilibili.com/player.html?aid=19388000&cid=31616791&page=1"
 scrolling="no" border="0" frameborder="no"
 framespacing="0" allowfullscreen="true">
</iframe>
```

### 爱奇艺

<embed src="//player.video.qiyi.com/dfa6fe2093c348e79481c44ac0f3e6b6/0/0/v_19rrg5wb8o.swf-albumId=137671300-tvId=137671300-isPurchase=false-cnId=5" allowFullScreen="true" quality="high" width="100%" height="350" align="middle" allowScriptAccess="always" type="application/x-shockwave-flash">

使用如下：

```html
<!-- before -->
<embed src="//player.video.qiyi.com/dfa6fe2093c348e79481c44ac0f3e6b6/0/0/v_19rrg5wb8o.swf-albumId=137671300-tvId=137671300-isPurchase=false-cnId=5"
 allowFullScreen="true" quality="high"
 width="480" height="350" align="middle"
 allowScriptAccess="always" type="application/x-shockwave-flash"></embed>

<!-- after -->
<embed src="//player.video.qiyi.com/dfa6fe2093c348e79481c44ac0f3e6b6/0/0/v_19rrg5wb8o.swf-albumId=137671300-tvId=137671300-isPurchase=false-cnId=5"
 allowFullScreen="true" quality="high"
 width="100%" height="350" align="middle"
 allowScriptAccess="always" type="application/x-shockwave-flash">
```

总体看起来，(不用看了) Youtube 使用体验最佳，而且在使用嵌入代码之前还可以进行一些设置，可惜的是它不在『我方包围圈』，次之，国内的来看，还是要优酷的要清爽一些。当然，此外肯定还有很多其他视频平台提供分享的，使用方法都是一样的，就不一一列举了。

## 推文

### Twitter

<blockquote class="twitter-tweet" data-lang="zh-cn"><p lang="et" dir="ltr">Hawaiia’n sea turtles | Photography by Chad Koga <a href="https://t.co/dt7zmKWK0b">pic.twitter.com/dt7zmKWK0b</a></p>&mdash; Earth Pics 🌎 (@earthescope) <a href="https://twitter.com/earthescope/status/1033099146507509760?ref_src=twsrc%5Etfw">2018年8月24日</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

在博客中也是可以嵌入推特推文的，只需从推文处获取嵌入代码即可，当然，需要科学上网，国内环境是会被解析成引用块。

暂时就想到这么多啦，如果你还有什么外链嵌入代码以上没有提及的，欢迎与我联系。
