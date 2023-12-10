---
title: 我的 Termux 软件包存储库
tags:
  - Linux
  - Termux
categories:
  - Android
  - Termux
abbrlink: 35761
cover: /res/cover/35761.png
top_img: /res/cover/35761.png
date: 2022-09-06 19:10:59
updated: 2022-09-08 20:00:00
---
## 起因
因为一些需要，我曾用自己匮乏的编程知识写过一些小工具。但是我担心放在 bin 目录时间长了会忘记哪些是自己写的，删除的时候不方便。

也曾尝试过另外添加一个 PATH 目录用来存放自己的小工具。但是我有强迫症，每次看到我添加的 PATH 目录都忍不住想删除，正巧最近看到了 atilo 的做法，想着自己也弄一个软件源，可以用来分享自己的工具。

同时，还解决了我的一些问题。

## 步骤
### 第一步，安装 `apt-ftparchive`
```bash
~ $ apt update && apt install apt-ftparchive
```
如果没有意外的话，这样就安装好了。

### 第二步，生成软件包
先创建一个目录用来存放已经编译完成的文件，并进入这个目录。

```bash
~ $ mkdir tool
~ $ cd tool
```

接下来创建 DEBIAN 目录，用来存放软件包的信息和脚本。

注意，这个 DEBIAN 目录需要 0755 以上的权限，并且不能高于 0775 。

我就不给它太高的权限了，给它最低的权限就够了。

```bash
~/tool $ mkdir DEBIAN
~/tool $ chmod 755 DEBIAN
```

我先说一下 DEBIAN 目录下的文件都有哪些。

DEBIAN 目录下有一个 `control` 文件和至多四个脚本文件。

#### control
`control` 文件用于写入安装包的识别信息，包括包名、版本、作者、简介等。没有严格的顺序要求。表格中列出常用的关键字和作用。`control` 文件最后需要添加一个空行。

| Name | Description |
| :----: | :----: |
| Package | 软件名，`dpkg -l` 列出的名字 |
| Version | 版本号 - 修订号 |
| Section | 软件类型，比如 mail, test, x11 等 |
| Priority | 优先级 / 重要性，比如 optional 可选的 |
| Architecture | 软件架构，比如 x86, arm64 |
| Depends | 依赖环境，用，隔开，用 (>=<) 指定版本号 |
| Suggests | 推荐安装，指非必要依赖，可以提供更多功能 |
| Maintainer | 作者 <邮箱或者其他联系方式> |
| Descritprion | 简介，可以换行书写 |

#### 额外脚本
DEBIAN 目录下最多可以放置四个可执行脚本，包括安装前执行的的 `preinst`、安装后执行的 `postinst`、卸载前执行的 `prerm`、卸载前执行的 `postrm` 四个脚本，它们都需要以 `#!/bin/bash` 开头，内容与普通脚本无异，文件名不需要后缀。

四个脚本都需要在打包前给予执行权限。

```bash
chmod a+x preinst
```
这是它们的作用

| 脚本 | 作用 |
| :----: | :----: |
| preinst | Debian 软件包 (“.deb”) 解压前执行的脚本，为正在被升级的包停止相关服务，直到升级或安装完成 (成功后执行 postinst 脚本)。 |
| postinst | 主要完成软件包 (“.deb”) 安装完成后所需的配置工作。通常，`postinst` 脚本要求用户输入，和 / 或警告用户如果接受默认值，应该记得按要求返回重新配置这个软件。 一个软件包安装或升级完成后，postinst 脚本驱动命令，启动或重启相应的服务。 |
| prerm | 停止一个软件包的相关进程，要卸载软件包的相关文件前执行。 |
| postrm | 修改相关文件或连接，和 (或) 卸载软件包所创建的文件。当前的所有配置文件都可在 /var/lib/dpkg/info 目录下找到，与 foo 软件包相关的命名以 “foo” 开头，以 `preinst`, `postinst`, 等为扩展。这个目录下的 foo.list 文件列出了软件包安装的所有文件。Debian 里用 `apt-get` 安装或卸载软件时，会常发生前处理或后处理的错误，这时只要删除对应的脚本文件，重新执行安装或卸载即可。 |

#### md5sums
为了防止安装包被篡改，可以计算每个二进制文件的 md5 值存放在这个文件里。非必要。

好了，我们接下来创建 `control` 文件

```bash
~/tool $ touch DEBIAN/control
```
接着编辑 `control` 文件，具体内容我就不放出来了，你可以根据我上面的内容填写。

因为我的软件包不复杂，所以不需要其他东西，另外四个脚本就不用建立了。

整个目录下除了 DEBIAN 以外，都是与系统目录一一对应的。

我要打包的是 Termux 的软件包，所以目录也需要和 Termux 的文件目录一致。同时，因为没什么配置文件，只有可执行文件，所以只要一个 bin 目录就够了。

```bash
~/tool $ mkdir -p data/data/com.termux/files/usr/bin
```'
然后让我们把我们自己的可执行文件复制进去。注意不要与其他软件包的可执行文件的文件名一致。

```bash
~/tool $ cp <myfile> data/data/com.termux/files/usr/bin
```
接着我们回到上级目录，然后用打包命令打包。

```bash
~ $ dpkg -b tool tool.deb
```

### 第三步，构建源目录
```bash
~ $ mkdir -p source/dists/termux/extras/binary-all
```
把 `tool.deb` 复制到 `source/dists/termux/extras/binary-all`

然后执行这些命令初始化:

```bash
~ $ cd source
~/source $ apt-ftparchive packages . > ./dists/termux/extras/binary-all/Packages
~/source $ apt-ftparchive contents . > ./dists/termux/extras/Contents-all
~/source $ cd ./dists/termux && apt-ftparchive release . | xargs -0 -I {} echo -e "Codename: termux\nVersion: 1\nArchitectures: all\nDescription: termux repository\nSuite: termux\n{}" > ./Release
```
最后，用 `tree` 命令查看目录结构，结果如下:

```bash
~/source $ tree
.
├── deploy
└── dists
    └── termux
        ├── Release
        └── extras
            ├── Contents-all
            └── binary-all
                ├── Packages
                ├── mkfsntfs_1.0.0_aarch64.deb
                ├── music-unlock_1.0.0_aarch64.deb
                ├── mytool_1.0.0_aarch64.deb
                ├── mytool_1.0.0_all.deb
                ├── rish-sui_1.0.0_all.deb
                ├── rish_1.0.0_all.deb
                ├── termux-switch_1.0.1_all.deb
                └── tidyfile_1.0.0_all.deb
```

### 第四步，部署到服务器
这里我用 Github 的 Github Pages 服务

先去 Github 创建一个仓库，复制 URL

接着用 `git` 命令上传

```bash
~/source $ git init
~/source $ git add .
~/source $ git commit -m "First Push"
~/source $ git remote add origin <URL>
~/source $ git push --set-upstream origin master
```
OK，一切完成

### 第五步，添加源
```bash
echo "deb [trusted=yes arch=all] <URL> termux extras" > $PREFIX/etc/apt/sources.list.d/mysource.list
```
注意，这里的 URL 不是仓库的 URL，而是你部署的 Github Pages 的访问链接。

现在更新一下源，就能开始安装自己的软件包了。

```bash
~ $ apt update
~ $ apt install tool
```
