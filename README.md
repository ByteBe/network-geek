# 华为/华三命令集扩展

[![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)](https://github.com/ByteBe/network-geek)
[![VS Code](https://img.shields.io/badge/VS%20Code-1.80+-007ACC.svg)](https://code.visualstudio.com/)
[![Author](https://img.shields.io/badge/author-network--geek-orange.svg)](https://github.com/ByteBe)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

<p align="center">
  <img src="images/icon.png" alt="华为/华三命令集图标" width="128" height="128">
</p>

## 📋 简介

为网络工程师量身打造的华为（Huawei）和华三（H3C）交换路由设备命令集支持扩展。提供丰富的命令提示、代码片段、语法高亮和自动更新功能，极大提升网络设备配置效率。

**作者：network-geek** | **版本：1.1.0**

---

## ✨ 功能特性

### 🎯 核心功能
| 功能 | 描述 |
|------|------|
| **智能命令提示** | 超过400条华为/华三命令自动补全 |
| **代码片段** | 30+常用配置模板，一键插入 |
| **语法高亮** | 专业级语法着色，提升可读性 |
| **悬停提示** | 鼠标悬停显示命令说明和示例 |
| **自动更新** | 自动检查更新，保持最新版本 |

### 📚 支持的命令类别

| 类别 | 包含命令 |
|------|----------|
| **系统管理** | `system-view`, `sysname`, `save`, `display`, `rollback` 等 |
| **接口配置** | `interface`, `ip address`, `shutdown`, `description`, `mtu` 等 |
| **VLAN配置** | `vlan`, `vlan batch`, `port link-type`, `port trunk` 等 |
| **路由协议** | `ospf`, `rip`, `bgp`, `isis`, `static`, `policy-based-route` 等 |
| **安全配置** | `acl`, `traffic-filter`, `qos`, `port-security`, `firewall` 等 |
| **STP/MSTP** | `stp`, `rstp`, `mstp`, `bpdu-protection`, `root-protection` 等 |
| **DHCP服务** | `dhcp enable`, `dhcp server`, `dhcp snooping`, `dhcp relay` 等 |
| **高可用性** | `vrrp`, `bfd`, `smart-link`, `rrpp`, `monitor-link` 等 |
| **堆叠集群** | `stack`, `irf`, `cluster` |
| **链路聚合** | `eth-trunk`, `lacp`, `load-balance` |
| **网络诊断** | `ping`, `tracert`, `telnet`, `ssh`, `debugging` 等 |
| **SNMP/NTP** | `snmp-agent`, `ntp-service`, `clock timezone` 等 |
| **文件系统** | `dir`, `copy`, `delete`, `rename`, `format` 等 |

### 🏢 厂商特有命令

| 厂商 | 特有命令 |
|------|----------|
| **华为** | `vrrp`, `bfd`, `ipsec`, `ike`, `interface Vlanif`, `interface Eth-Trunk` |
| **华三** | `irf`, `rrpp`, `smart-link`, `monitor-link`, `port group` |

---

## 🚀 快速开始

### 安装方法

#### 方法一：从VS Code安装（推荐）
1. 打开VS Code
2. 进入扩展视图 (`Ctrl+Shift+X`)
3. 搜索 `华为/华三命令集` 或 `huawei h3c`
4. 点击安装

#### 方法二：手动安装
```bash
# 下载vsix文件后执行
code --install-extension huawei-h3c-commands-1.1.0.vsix