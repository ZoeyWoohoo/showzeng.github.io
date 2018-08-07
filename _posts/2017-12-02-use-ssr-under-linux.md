---
layout: post
title: "Linux 下使用酸酸乳"
date: 2017-12-02 19:04:29 +0800
category: [shadowsocksR, Linux]
excerpt: 国内形式不容乐观，以前用的 SS 都转向为仅支持 SSR，Linux 下优秀的 shadowsocks-qt5 客户端也仅支持 SS。于是，自己写了几个脚本，可以让你方便地在命令行下运行 shadowsocksR。
---

## 前言

在 10011 大之前，虽然一向墙越来越高，但也没造成多大的影响，在 Linux 下用着 shadowsocks-qt5 客户端也是相当的便捷，那时候，供应商还支持着 SS 和 SSR，因为便捷，所以一直没有转向用 SSR。之后破娃那事一出，还稍微担心了一下以后怎么用 SSR，好在互联网是有记忆的，github 上的备份也比较多。

10011 大之后，国内形式不容乐观，供应商各种删库跑路 (到现在 tg 群还是各种日常问候群主全家的 :p)，逐渐地也变成了仅支持 SSR。于是乎，花了点时间研究了一下 Linux 下 SSR 的简单使用，写了几个小脚本 (就是为了偷懒)，对于个人的日常使用，应该是挺方便。如何刚好你也用的上，那就太棒了 :p 。

## 使用方法

### 克隆或者直接下载 ssr

```
~ $ git clone https://github.com/showzeng/shadowsocksr
```

### 在 Linux 下使用

克隆或下载好之后，打开 shadowsocksr 文件夹，找到 config.json 配置文件，在这里填写好你相应的节点信息，下面是示例：

![config example](https://www.z4a.net/images/2017/12/02/Config.png)

一般主要修改的就这几项，根据你自己的节点设置来填写。

修改好之后，打开你的终端，进入 shadowsocksr 文件夹 (根据自己所处的路径):

```
~ $ cd shadowsocksr/
```

然后将 runssr 和 stopssr 两个脚本修改为可执行文件并移动到 `/usr/local/bin/` 目录下，这样将其添加到了环境变量中，以后输入命令就可执行:

```
~/shadowsocksr [manyuser] $ chmod 755 runssr stopssr
~/shadowsocksr [manyuser] $ sudo mv runssr stopssr /usr/local/bin
[sudo] password for xxxx:
```

将整个项目文件移动到 `/opt/` 目录下，其实之所以做这一步，是因为个人习惯。我一般将自己手动安装的应用都放在 `/opt/` 目录下，比如：chrome、Intellij 全家桶、sublime text 等，如果你不想将项目移动到 `/opt/` 下，你需要手动修改 runssr 和 stopssr 里面的路径 (也就一两行命令，一看就知道在哪里改)。好了，文件夹移动的操作如下 (假设此时还是在 shadowsocksr 下)：

```
~/shadowsocksr [manyuser] $ ../
~ $ sudo mv shadowsocksr/ /opt/
```

最后，只需要激活一下环境变量：

```
~ $ source /etc/profile
```

现在，你就可以使用如下命令来随意地打开或关闭 SSR。

### 打开 SSR

```
~ $ runssr
```

### 关闭 SSR

```
~ $ stopssr
```

比如你电脑刚开机时，打开终端，直接运行 runssr，还不是美滋滋。

## 后记

经过上面一通操作之后，如果以后需要修改节点信息，其配置文件在如下位置：

```
/opt/shadowsocksr/config.json
```
输出日志在如下位置：

```
/opt/shadowsocksr/shadowsocks/ssserver.log
```

如果你想卸载 SSR，直接将整个文件夹和两个脚本文件删除即可：

```
~ $ sudo rm -r /opt/shadowsocksr
~ $ sudo rm /usr/local/bin/runssr /usr/local/bin/stopssr
```

### Github 项目地址

* [shadowsocksr](https://github.com/showzeng/shadowsocksr)

也算是做个备份，很惭愧，也就做了些微小的工作，希望能帮到你 :)
