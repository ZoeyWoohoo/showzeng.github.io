---
title: "Linux 上遇到的 '坑' (持续更新)"
date: 2017-12-04 11:02:29 +0800
category: Linux
tags: [Linux, Arch]
excerpt: 介于目前已从 Ubuntu 切换到 Arch 环境，大部分遇到的问题都是关于 Arch 的，但大多问题，大同小异，Linux 下都是共通的，如果你刚好也遇到相同的问题，希望能帮到你 :p
---

## Android Studio 代理

**Android Studio 设置代理失败，导致 gradle 因下载不了第三方库而跑不起来**。Linux 下使用 ShadowsocksR 无法实现全局代理，而 Android Studio 上的代理设置，使用本地 socks5 代理 (127.0.0.1:1080) 无效 (或者是 http/https 也无效，理论上根据 ShadowsocksR 的配置就应该是 socks5 代理)，我也不知道是什么原因。这一问题很蛋疼，因为第三方就只能手动下载 jar 包导入了。直到一天想到了能不能先用手机代理后，电脑连接手机热点来实现代理，搜索了一下，还真的可行，最重要的是，我的「米6」在连接 wifi 之后，能够通过热点的方式共享 wifi 网络，那么，我的手机就相当于一个中转站了。

接下来说一下方法，需要「日常 fq 的 SSR」+「Proxy Server」(可在 [APKPure](https://apkpure.com/proxy-server/com.icecoldapps.proxyserver) 官网下载，或者在下面我提供的「百度云」分享下载)。打开 ShadowsocksR 全局代理后，进入 Proxy Server，点击 Add -> Proxy Server -> 填写代理名称 (随便命令如：代理1)，代理端口无需修改按它随机生成的即可 -> 按返回键 -> 在弹框提示中点击保存 -> 点击 Start -> 点击 Info (可以看到倒数第三行的 IPv4 地址)。

![ProxyServer.jpg](https://www.z4a.net/images/2018/05/20/ProxyServer.jpg)

接下来，电脑连接手机热点之后，系统设置网络代理 http 和 https，ip 地址为上述说的 Info 信息里倒数第三行的 IPv4 地址，端口号则为之前随机生成的那个端口。

![SystemProxySetting.png](https://www.z4a.net/images/2018/05/20/SystemProxySetting.png)

Android Studio 里打开代理设置，设置 http 代理为同样的 ip 和端口号即可。

![ASProxySetting.png](https://www.z4a.net/images/2018/05/20/ASProxySetting.png)

代理连接测试 Google 成功。

![ProxyTest.png](https://www.z4a.net/images/2018/05/20/ProxyTest.png)

![ProxyTestSucceed.png](https://www.z4a.net/images/2018/05/20/ProxyTestSucceed.png)

**Proxy Server 安装包云盘资源**：[[百度云]]

## Gnome Gedit

**安装 gedit 之后，chrome 或其他显示 '在文件夹中打开' 的选项默认都使用 gedit 打开**。这个是一个比较奇怪的问题，为此之前卸载过一次 gedit，一切恢复正常。但是个人比较偏爱于这个 gnome 自带的文本编辑器，简洁干净又美观，编辑文档，写文章时，都喜欢用它。

![gedit UI](https://www.z4a.net/images/2017/12/04/geditUI.png)

于是，又把它下了回来，然后就又碰上了上面所说的这个问题。「Show in folder」本该是直接使用 nautilus 文件管理打开，为什么用 gedit 打开呢？你要用它打开就算了，你又不支持打开文件夹，搞毛啊 :(

![gedit error](https://www.z4a.net/images/2017/12/04/geditError.png)

一番搜索，在 Ask Ubuntu 上找到了相同的问题，结合其他信息及 Arch Wiki，验证总结出以下几种解决方案。

**1.修改 mimeapps.list 将如下图所示行注释掉：**

![annotate gedit item](https://www.z4a.net/images/2017/12/04/commentoutEdited.png)

mimeapps.list 路径为 ~/.config/mimeapps.list，根据 wiki 上的说明：

```
~/.local/share/applications/mimeapps.list
```

其已经被弃用了，所以，此时若按 Ask Ubuntu 上的方法，你会发现列表文件是空的。

![mimeapps list path](https://www.z4a.net/images/2017/12/04/mimelistPath.png)

也就是说，安装 gedit 之后，它会默认向 mimeapps.list 文件里写入这个启动配置选项，注释之后即恢复正常。

**2.使用 xdg-open 将 nautilus 设为默认目录打开程序：**

chrome 是使用 xdg-open 来管理文件类型对应的打开程序，使用 xdg-utils 可以直接查询修改这些配置，但是这里有一点比较奇怪，就是当我查询目录默认打开程序的时候，显示的竟然是 nautilus，但还是再执行了一遍，将其设置为默认程序，然后再打开，就恢复正常了。以下是命令行上的操作：

```
~ $ xdg-mime query default inode/directory
org.gnome.Nautilus.desktop
(第一次查询显示的结果)
~ $ xdg-open Downloads
(这里仍旧使用 gedit 打开)
~ $ xdg-mime default org.gnome.Nautilus.desktop inode/directory
~ $ xdg-open Downloads
(这里恢复正常，使用 nautilus 文件管理系统打开)
```

**3.使用 xdg-open 的替代方案手动设置文件打开程序：**

由于 xdg-utils 里 xdg-open 的版本很复杂，可能有时候出问题的时候很难 debug，因此，就有了一些替代的选择。这里可以用 mime-open 和 mimeo 设置使用。

==> **mime-open**

```
~ $ sudo pacman -S perl-file-mimeinfo
~ $ mimeopen -d /home/showzeng/Downloads
(这里选择 nautilus 选项相应的数字)
~ $ mimeopen -n Downloads/
(验证是否使用 nautilus 打开文件夹)
```

==> **mimeo (在 Aur 仓库)**

```
~ $ pacaur -S mimeo
~ $ mimeo -m Downloads/
Downloads
  inode/directory
(先判断文件夹的 MIME 类型)
~ $ mimeo --add inode/directory org.gnome.Nautilus.desktop
(设置 nautilus 为默认打开程序)
~ $ mimeo Downloads/
(验证是否使用 nautilus 打开文件夹)
```

很抱歉，第三种解决方案，由于网络原因及验证签名失败，mime-open 和 mimeo 都没装成功，以下是各安装过程中的报错：

```
mime-open
---------------
error: failed retrieving file 'perl-ipc-system-simple-1.25-3-any.pkg.tar.xz'
from mirrors.ustc.edu.cn : Resolving timed out after 10517 milliseconds

mimeo
---------------
==> Verifying source file signatures with gpg...
    mimeo-2017.6.6.tar.xz ... FAILED (unknown public key 1D1F0DC78F173680)
==> ERROR: One or more PGP signatures could not be verified!
:: failed to verify mimeo integrity
```

那你可能会问，解决方案哪来的，这是根据 wiki 总结出来的，应该是没有问题的，你也可以验证一下 :p ，其实也是自己懒得再解决这两个安装问题了，毕竟第一种方案就解决了我的问题，哈哈:stuck_out_tongue_closed_eyes:。

**参考文档**：[[Ask Ubuntu]] [[Superuser]] [[Arch Wiki(Default applications)]]

## 中文字体发虚

**安装完 WPS 后，系统中文字体发虚**。首先个人平时最喜欢的字体是 Monaco 加上 wqy-microhei (文泉驿微米黑) 如果你没有安装这两个字体，强烈建议你安装使用：

==> **安装 Monaco、wqy-microhei 字体**

```
~ $ sudo pacman -S ttf-monaco
~ $ sudo pacman -S wqy-microhei
```

WPS 无疑是一款优秀的软件，以前用 Ubuntu 的时候也装过，那时候，表格应用还有中文无法渲染，显示方框的问题一直也没有去解决，但是仅作为偶尔查看一下文档来用，还无伤大雅，主力写报告时还是切回 Windows。而今发现在 Arch 安装时，首先打开应用会提示缺少 Symbol 字体，这简单，直接仓库搜索一下 Symbol 字体，会发现有个 WPS 的字体包：

==> **安装 Symbol 字体**

```
~ $ sudo pacman -S ttf-wps-fonts
```

就在这个命令执行完了之后，我发现系统中文字体发虚了，那个时候正开着 Chrome，看着页面上的字体简直无法直视。

刚开始觉得是 Symbol 字体安装完之后覆盖了设置，然后自己在 Tweaks 中又把字体设置一遍 (之前直接设置为 Monaco)，可是突然想起，这和中文字体的渲染没有关系，应该是在其他什么配置文件中设置。Google 一番之后找到了原因，安装 WPS 之后，附带的方正字体使得 Serif (衬线体) 和 Sans-Serif (非衬线体，对中文而言为黑体) 字体的中文部分默认指向了方正宋体。这一点可以在字体文件中得到验证：

![WPS-office fonts](https://www.z4a.net/images/2017/12/18/wps-font.png)

这里充斥着各种方正字体。问题找到了怎么解决呢？通过 FontConfig 修改配置文件使 Serif 和 Sans-Serif 字体的渲染字体优先级提前即可。(网上提到的文泉驿官网提供的配置文件生成工具 [Fontconfig Designer](http://wenq.org/cloud/fcdesigner.html) 好像已经挂掉了) 配置文件的路径为：

```
/etc/fonts/conf.avail/50-user.conf
```

==> **原本未经修改的配置文件：**

``` xml
<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "fonts.dtd">
<fontconfig>
	<!--
	    Load per-user customization files where stored on XDG Base Directory
	    specification compliant places. it should be usually:
	      $HOME/.config/fontconfig/conf.d
	      $HOME/.config/fontconfig/fonts.conf
	-->
	<include ignore_missing="yes" prefix="xdg">fontconfig/conf.d</include>
	<include ignore_missing="yes" prefix="xdg">fontconfig/fonts.conf</include>
	<!-- the following elements will be removed in the future -->
	<include ignore_missing="yes" deprecated="yes">~/.fonts.conf.d</include>
	<include ignore_missing="yes" deprecated="yes">~/.fonts.conf</include>
</fontconfig>
```

==> **修改后的配置文件：**

``` xml
<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "fonts.dtd">
<fontconfig>
<match>
    <test name="family"><string>sans-serif</string></test>
    <edit name="family" mode="prepend" binding="strong">
        <string>文泉驿微米黑</string>
            <!-- Please install 文泉驿微米黑 first -->
        <string>文泉驿等宽微米黑</string>
        <string>DejaVu Sans</string>
        <string>DejaVu Sans</string>
        <string>WenQuanYi Micro Hei</string>
            <!-- Please install WenQuanYi Micro Hei first -->
        <string>WenQuanYi Bitmap Song</string>
            <!-- Please install WenQuanYi Bitmap Song first -->
        <string>Cantarell</string>
            <!-- Please install Cantarell first -->
        <string>DejaVu Sans Condensed</string>
        <string>DejaVu Sans Light</string>
        <string>DejaVu Sans Mono</string>
        <string>DejaVu Serif</string>
        <string>DejaVu Serif Condensed</string>
    </edit>
</match>
<match>
    <test name="family"><string>serif</string></test>
    <edit name="family" mode="prepend" binding="strong">
        <string>文泉驿微米黑</string>
            <!-- Please install 文泉驿微米黑 first -->
        <string>文泉驿等宽微米黑</string>
        <string>DejaVu Sans</string>
        <string>DejaVu Serif</string>
        <string>WenQuanYi Bitmap Song</string>
            <!-- Please install WenQuanYi Bitmap Song first -->
        <string>Bitstream Charter</string>
            <!-- Please install Bitstream Charter first -->
        <string>Cantarell</string>
            <!-- Please install Cantarell first -->
        <string>DejaVu Sans Condensed</string>
        <string>DejaVu Sans Light</string>
        <string>DejaVu Sans Mono</string>
        <string>DejaVu Serif</string>
        <string>DejaVu Serif Condensed</string>
    </edit>
</match>
</fontconfig>
```

保存修改之后就应该可以看到效果了，如果没有变化，试着重启一下。最后看一下恢复字体之后的界面：

![UI recover](https://www.z4a.net/images/2017/12/18/ui-recover.png)

Awesome :p

**参考文档**：[[WPS 社区]] [[Arch Wiki(Font configuration)]]

[Ask Ubuntu]: https://askubuntu.com/questions/39769/chromium-show-in-folder-opens-in-text-editor
[Superuser]: https://superuser.com/questions/721637/how-do-i-fix-chrome-show-in-folder-to-open-in-file-explorer-and-not-in-new-tab
[Arch Wiki(Default applications)]: https://wiki.archlinux.org/index.php/Default_applications#Set_default_applications
[WPS 社区]: http://bbs.wps.cn/thread-22353520-1-1.html
[Arch Wiki(Font configuration)]: https://wiki.archlinux.org/index.php/Font_configuration#Replace_or_set_default_fonts
[百度云]: https://pan.baidu.com/s/1oNQ2jL2s1jFfFzFrMfwmpw
