---
title: 在 Termux 中使用 rar 压缩文件
tags:
  - Termux
  - Android
categories:
  - Android
  - Termux
abbrlink: 1188592649
date: 2025-09-15 13:02:20
---
众所周知，因为 RARLAB 的授权问题。

> RAR 文件只能使用商业软件 WinRAR （Windows）、 命令行 RAR（Windows、MS-DOS、macOS、Linux、Android 和 FreeBSD） 以及其他获得 Alexander Roshal 书面许可或在 Alexander Roshal 许可下共享受版权保护的代码的软件创建。

市面上的压缩软件几乎都不支持压缩 rar 格式的压缩包，只能解压缩。但是 RARLAB 又没有提供适用于 Android/Termux 的 ARM64 CLI 程序，想要压缩 rar 只能下载 RARLAB 提供的安卓应用，除此之外别无他法。

但是！RARLAB 提供了适用于 Linux x64 的压缩程序（命令行 RAR），而 Termux 有一个 Glibc 仓库，其中编译了 box64 包，这为我们在 Termux 运行 rar 提供了理论基础！

理论存在实践开始！

## 理论实践
1. 打开 [RARLAB 下载页面](https://www.rarlab.com/download.htm)，找到 [RAR for Linux x64 7.12](https://www.rarlab.com/rar/rarlinux-x64-712.tar.gz) 并下载到 Termux $HOME 目录
    - 可以复制下载链接直接使用 wget 下载到 Termux 中

2. 使用 tar 解压 RAR for Linux x64 7.12
```shell
tar -zxf rarlinux-x64-712.tar.gz
```

3. 安装/配置 glibc 和 box64
    1. 安装 glibc 存储库
```shell
pkg in glibc-repo
```
    2. 安装 glibc 和 box64
```shell
pkg in glibc box64-glibc
```
    3. 尝试使用 box64 运行 rar
```shell
glibc-runner -s $PREFIX/glibc/bin/box64 ./rar/rar | cat
```

## 编写脚本方便调用
这一步很简单，就是找个地方存放 rar 和 unrar，使用上方的命令调用即可

**Tips**: 不想自己写的可以直接安装我打包好的版本

## 下载/安装
  - 下载我打包的 [termux-rar_1.0.1_all.deb](https://dists.netlify.app/pool/xireiki/termux-rar_1.0.1_all.deb)，使用 `dpkg -i termux-rar_1.0.1_all.deb` 安装 termux-rar
  - 一键安装命令: `curl -sL dists.xireiki.com/install.sh | bash && pkg in termux-rar`
