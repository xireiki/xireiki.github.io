---
title: 记使用 sing-box 搭建 hysteria2 代理
tags:
  - sing-box
  - 代理
  - hysteria2
categories:
  - 代理
  - 搭建
  - hysteria2
abbrlink: 3866594125
date: 2023-12-10 13:30:04
---
# 前言
之前用一键脚本搭建过 trojan 代理，但是一键脚本我不太喜欢。

想起 sing-box 的入站支持好多协议，就想着用它搭建一下玩玩。

# 过程
## 环境
| 项目 | 版本 |
| :----: | :----: |
| debian | 任意 |
| sing-box | v1.8.0-alpha.17 |

## 过程
### 第一步，下载 sing-box
从 [GitHub](https://github.com/SagerNet/sing-box/releases) 下载 sing-box 可执行文件。

我的服务器是 arm64 架构的 linux，所以下载 sing-box-1.8.0-alpha.17-linux-arm64.tar.gz

下载后使用 tar 命令解压文件，从 sing-box-1.8.0-alpha.17-linux-arm64（每个版本不一样，解压后只有一个文件夹）中找到 sing-box 并复制到配置目录（我的是 **/root/proxy**）后给予执行权限，命令如下：

```bash
mkdir /root/proxy
wget https://github.com/SagerNet/sing-box/releases/download/v1.8.0-alpha.17/sing-box-1.8.0-alpha.17-linux-arm64.tar.gz
tar -zxf sing-box-1.8.0-alpha.17-linux-arm64.tar.gz
cp sing-box-1.8.0-alpha.17-linux-arm64/sing-box /root/proxy
cd /root/proxy
chmod 700 sing-box
```

### 第二步，生成 pem 私钥和 csr 证书
先使用 `sudo apt install openssl` 安装 openssl，用于生成私钥和证书

我把证书放在 /root/proxy/src 中，所以先创建文件夹: `mkdir -p /root/proxy/src`

使用 `cd /root/proxy/src` 进入文件夹。

现在开始生成私钥，命令是这个 `openssl genpkey -algorithm RSA -out key.pem`

注意！私钥不能是加密的，不然 sing-box 不认。

接着使用私钥生成证书请求 **cert.csr**，`openssl req -new -key key.pem -out cert.csr`

这个命令将会生成一个证书请求，当然，用到了前面生成的私钥 **key.pem** 文件。

这里将生成一个新的文件 **cert.csr**，即一个证书请求文件，你可以拿着这个文件去数字证书颁发机构（即CA）申请一个数字证书。CA会给你一个新的文件 **cert.pem**，那才是你的数字证书。

当然，我就自己用用，没必要去 CA 申请。所以我们可以使用私钥 **key.pem** 和证书请求 **cert.csr** 生成一个数字证书，命令如下：

```bash
openssl x509 -req -in cert.csr -signkey key.pem -out cert.pem -days 3650
```

使用这个命令会提示输入一些信息，比如国家等，按照提示输入即可。

### 第三步，写一个配置文件
我的配置文件名是 **server.json**

主要字段如下（...表示省略）：

```json
{
  ...
  "inbounds": [
    {
      "type": "hysteria2", // 入站类型
      "tag": "hy2",
      "listen": "::",
      "listen_port": 1081,
      "sniff": true,
      "sniff_override_destination": true,
      "domain_strategy": "prefer_ipv6", // ipv6 优先
      "up_mbps": 1000,
      "down_mbps": 1000,
      "users": [
        {
          "name": "root",
          "password": "abd12de3" // 认证密码
        }
      ],
      "tls": {
        "enabled": true,
        "certificate_path": "src/cert.crt", // 证书路径
        "key_path": "src/key.pem" // 私钥路径
      }
    }
  ],
  ...
}
```

具体配置可参考 [sing-box wiki](https://sing-box.sagernet.org/zh)

### 第四步，使用 systemd 开机自启
在 **/etc/systemd/system/myproxy.service** 创建一个文件（myproxy.service），内容如下（根据实际情况修改）：

```
[Unit]
Description=sing-box Proxy
After=network.target

[Install]
WantedBy=multi-user.target

[Service]
Type=simple
WorkingDirectory=/root/proxy
ExecStart=/root/proxy/sing-box -D /root/proxy -c /root/proxy/server.json run
Restart=always
```

接着使用 `systemctk enable myproxy` 命令启用开机自启。

### 第五步，配置客户端出站

sing-box:

```json
{
  ...
  "outbounds": [
    ...
    {
      "tag": "MyProxy", // 出站名称，任意皆可
      "type": "hysteria2", // 不能改，出站类型
      "server": "xxx.xxx.xxx.xxx", // 此处替换为你服务器IP地址
      "server_port": 1081, // 你设置的端口
      "password": "abd12de3", // 认证密码，输入你在 server.json 中配置的
      "tls": {
        "enabled": true,
        "insecure": true
      },
      "down_mbps": 1000
    },
    ...
  ],
  ...
}
```

clash.meta:

```yaml
proxies:
  - name: MyProxy #名称任意
    type: hysteria2
    server: xxx.xxx.xxx.xxx # 服务器IP地址
    port: 1081 # 你设置的端口
    password: abd12de3 # 认证密码
    insecure: true
    down: 1000
```

### 完成
愉快的开始使用吧！
