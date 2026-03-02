# 华为/华三命令集扩展

[![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)](https://github.com/ByteBe/network-geek)
[![VS Code](https://img.shields.io/badge/VS%20Code-1.80+-007ACC.svg)](https://code.visualstudio.com/)
[![Author](https://img.shields.io/badge/author-network--geek-orange.svg)](https://github.com/ByteBe)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

**作者：network-geek** | **版本：1.1.0**

---

## 📋 简介

为网络工程师量身打造的华为（Huawei）和华三（H3C）交换路由设备命令集支持扩展。提供丰富的命令提示、代码片段、语法高亮和自动更新功能，极大提升网络设备配置效率。

---

## ✨ 功能特性

### 核心功能

| 功能 | 描述 |
|------|------|
| **智能命令提示** | 超过400条华为/华三命令自动补全 |
| **代码片段** | 30+常用配置模板，一键插入 |
| **语法高亮** | 专业级语法着色，提升可读性 |
| **悬停提示** | 鼠标悬停显示命令说明和示例 |
| **自动更新** | 自动检查更新，保持最新版本 |

### 支持的命令类别

| 类别 | 包含命令 |
|------|----------|
| **系统管理** | system-view, sysname, save, display |
| **接口配置** | interface, ip address, shutdown |
| **VLAN配置** | vlan, vlan batch, port link-type |
| **路由协议** | ospf, rip, bgp, static |
| **安全配置** | acl, traffic-filter, qos |
| **STP/MSTP** | stp, rstp, mstp |
| **DHCP服务** | dhcp enable, dhcp server |
| **高可用性** | vrrp, bfd, smart-link |
| **堆叠集群** | stack, irf |
| **链路聚合** | eth-trunk, lacp |
| **网络诊断** | ping, tracert, ssh |

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
code --install-extension huawei-h3c-commands-1.1.0.vsix