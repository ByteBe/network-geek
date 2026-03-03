# 华为/华三命令集扩展

[![Version](https://img.shields.io/badge/version-1.2.0-blue.svg)](https://github.com/ByteBe/network-geek)
[![VS Code](https://img.shields.io/badge/VS%20Code-1.80+-007ACC.svg)](https://code.visualstudio.com/)
[![Author](https://img.shields.io/badge/author-network--geek-orange.svg)](https://github.com/ByteBe)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

**作者：network-geek** | **版本：1.2.0**

---

## 📋 简介

为网络工程师量身打造的华为（Huawei）和华三（H3C）交换路由设备命令集支持扩展。提供丰富的命令提示、代码片段、语法高亮和自动更新功能，极大提升网络设备配置效率。支持MPLS VPN、高级路由协议等企业级特性。

---

## ✨ 功能特性

### 核心功能

| 功能 | 描述 |
|------|------|
| **智能命令提示** | 超过700条华为/华三命令自动补全 |
| **代码片段** | 60+常用配置模板，一键插入 |
| **语法高亮** | 专业级语法着色，提升可读性 |
| **悬停提示** | 鼠标悬停显示命令说明和示例 |
| **自动更新** | 自动检查更新，保持最新版本 |

### 支持的命令类别

| 类别 | 包含命令 |
|------|----------|
| **系统管理** | system-view, sysname, save, display, rollback |
| **接口配置** | interface, ip address, shutdown, description, mtu |
| **VLAN配置** | vlan, vlan batch, port link-type, port trunk |
| **OSPF路由** | ospf, area, network, stub, nssa, import-route |
| **BGP路由** | bgp, peer, network, import-route, route-policy |
| **ISIS路由** | isis, network-entity, is-level, cost-style |
| **RIP路由** | rip, version, network, rip authentication |
| **静态路由** | ip route-static, 默认路由, 浮动路由, 等价路由 |
| **MPLS VPN** | mpls, ldp, vpn-instance, route-distinguisher, vpn-target |
| **策略路由** | policy-based-route, if-match, apply next-hop |
| **安全配置** | acl, traffic-filter, qos, port-security |
| **STP/MSTP** | stp, rstp, mstp, bpdu-protection, root-protection |
| **DHCP服务** | dhcp enable, dhcp server, dhcp snooping |
| **高可用性** | vrrp, bfd, smart-link, rrpp |
| **链路聚合** | eth-trunk, lacp, load-balance |
| **网络诊断** | ping, tracert, telnet, ssh, debugging |

---

## 🚀 快速开始

### 安装方法

#### 方法一：从VS Code市场安装
1. 打开VS Code
2. 进入扩展视图 (`Ctrl+Shift+X`)
3. 搜索 `华为/华三命令集` 或 `huawei h3c`
4. 点击安装

#### 方法二：手动安装
```bash
code --install-extension huawei-h3c-commands-1.2.0.vsix