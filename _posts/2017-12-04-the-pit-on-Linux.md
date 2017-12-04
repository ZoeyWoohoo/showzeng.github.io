---
layout: post
title: "Linux 上遇到的 '坑' (持续更新)"
date: 2017-12-04 11:02:29 +0800
category: Linux
excerpt: 介于目前已从 Ubuntu 切换到 Arch 环境，大部分遇到的问题都是关于 Arch 的，但大多问题，大同小异，Linux 下都是共通的，如果你刚好也遇到相同的问题，希望能帮到你 :p
---

### 安装 gedit 之后，chrome 或其他显示 '在文件夹中打开' 的选项默认都使用 gedit 打开

这个是一个比较奇怪的问题，为此之前卸载过一次 gedit，一切恢复正常。但是个人比较偏爱于这个 gnome 自带的文本编辑器，简洁干净又美观，编辑文档，写文章时，都喜欢用它。

![gedit UI](https://www.z4a.net/images/2017/12/04/geditUI.png)

于是，又把它下了回来，然后就又碰上了上面所说的这个问题。‘Show in folder’ 本该是直接使用 nautilus 文件管理打开，为什么用 gedit 打开呢？你要用它打开就算了，你又不支持打开文件夹，搞毛啊 :(

![gedit error](https://www.z4a.net/images/2017/12/04/geditError.png)

一番搜索，在 Ask Ubuntu 上找到了相同的问题，结合其他信息及 Arch Wiki，验证总结出以下几种解决方案。

**1.修改 mimeapps.list 将 inode/directory=org.gnome.gedit.desktop;anjuta.desktop; 这一行注释掉：**

![annotate gedit item](https://www.z4a.net/images/2017/12/04/commentoutEdited.png)

mimeapps.list 路径为 ~/.config/mimeapps.list，根据 wiki 上的说明，~/.local/share/applications/mimeapps.list 已经被弃用了，所以，此时若按 Ask Ubuntu 上的方法，你会发现列表文件是空的。

![mimeapps list path](https://www.z4a.net/images/2017/12/04/mimelistPath.png)

也就是说，安装 gedit 之后，它会默认向 mimeapps.list 文件里写入这个启动配置选项，注释之后即恢复正常。

**2.使用 xdg-open 将 nautilus 设为默认目录打开程序：**

chrome 是使用 xdg-open 来管理文件类型对应的打开程序，使用 xdg-utils 可以直接查询修改这些配置，但是这里有一点比较奇怪，就是当我查询目录默认打开程序的时候，显示的竟然是 nautilus，但还是再执行了一遍，将其设置为默认程序，然后再打开，就恢复正常了。以下是命令行上的操作：

``` text
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

``` text
~ $ sudo pacman -S perl-file-mimeinfo
~ $ mimeopen -d /home/showzeng/Downloads
(这里选择 nautilus 选项相应的数字)
~ $ mimeopen -n Downloads/
(验证是否使用 nautilus 打开文件夹)
```

==> **mimeo (在 Aur 仓库)**

``` text
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

``` text
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

那你可能会问，解决方案哪来的，这是根据 wiki 总结出来的，应该是没有问题的，你也可以验证一下 :p ，其实也是自己懒得再解决这两个安装问题了，毕竟第一种方案就解决了我的问题，哈哈。

>  **参考文档**：[[Ask Ubuntu]] [[Superuser]] [[Arch Wiki]] 

[Ask Ubuntu]: https://askubuntu.com/questions/39769/chromium-show-in-folder-opens-in-text-editor
[Superuser]:  https://superuser.com/questions/721637/how-do-i-fix-chrome-show-in-folder-to-open-in-file-explorer-and-not-in-new-tab
[Arch Wiki]:  https://wiki.archlinux.org/index.php/Default_applications#Set_default_applications

