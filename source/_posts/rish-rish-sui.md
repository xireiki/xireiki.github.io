---
title: rish && rish-sui
date: 2022-09-06 20:26:53
tags:
  - Linux
  - Android
  - Root
  - ADB
  - Termux
  - Shizuku
  - Sui
categories:
  - Android
  - Termux
abbrlink: 35750
top_img: /res/cover/35750.png
cover: /res/cover/35750.png
updated: 2022-09-08 20:00:00
---
还在为终端使用 `rish` 烦恼？

来试试 rish 吧！（指软件包，我打包的）

rish 有两个版本，Shizuku 版 和 Sui 。

## Shizuku 版的 rish
首先是 Shizuku 版的 Rish，软件包有以下命令: `rish`, `rido`, `sui`, `shizuku`

### 命令介绍
| 命令 | 描述 |
| :----: | :----: |
| rish | 切换到 shizuku 的 shell，权限为激活使用的方法，比如使用 adb (包括无线调试) 激活，就是 shell 权限 |
| rido | `rish -c "命令"` 的包装，用于方便的不切换 shell 执行命令 |
| sui | 使用当前 Shell 切换到 rish (需要激活方式为 Root，简单来说，你需要用 Root 激活 Shizuku) |
| shizuku | 老版本的终端调用方法，和 `rido` 类似 |

### 安装方法
  - 终端添加软件源
```bash
~ $ echo "deb [trusted=yes arch=all] https://dists.netlify.app termux extras" > $PREFIX/etc/apt/sources.list.d/xireiki.list
```
  - 然后更新源
```bash
~ $ apt update
```
  - 最后安装
```bash
~ $ apt install rish
```

### 各版本对应的 Sizuku 版本
| rish | Shizuku | CPU 架构 |
| :----: | :----: | :----: |
| 1.0.0 | 12.9.1.r859.28c5098 | aarch64(arm64), arm, x86, x86_64 |

注意！！！！！！！版本不同请谨慎安装！！！

## Sui 版的 rish
接着是 Sui 版的 Rish，软件包有如下命令: `rish`、`rido`、`sui`

### 命令介绍
| 命令 | 描述 |
| :----: | :----: |
| rish | 切换到 Sui 的 shell，权限为 Root (不会吧，都用 Sui 了，怎么可能不是 Root) |
| rido | `rish -c "命令"` 的包装，用于方便的不切换 shell 执行命令 |
| sui | 使用当前 Shell 切换到 rish |

### 安装方法
  - 终端添加软件源
```bash
~ $ echo "deb [trusted=yes arch=all] https://dists.netlify.app termux extras" > $PREFIX/etc/apt/sources.list.d/xireiki.list
```
  - 然后更新源
```bash
~ $ apt update
```
  - 最后安装
```
~ $ apt install rish-sui
```

### 各版本对应的 Sui 版本
| rish-sui | Shizuku | CPU 架构 |
| :----: | :----: | :----: |
| 1.0.0 | v12.6.3 | aarch64(arm64), arm, x86, x86_64 |

注意！！！！！！！版本不同请谨慎安装！！！
