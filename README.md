# 华为/华三命令集扩展

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://marketplace.visualstudio.com/items?itemName=network-geek.huawei-h3c-commands)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

为网络工程师提供的华为和华三交换路由设备命令集支持扩展。

## 功能特性

### 语法高亮
- 支持华为和华三设备命令语法高亮
- 区分关键字、字符串、数字和注释

### 智能提示
- 命令自动补全
- 参数提示
- 上下文相关的命令建议

### 代码片段
- 快速插入常用配置模板
- 支持系统视图、接口配置、VLAN配置等
- 支持OSPF、RIP、静态路由等路由协议配置
- 支持ACL、STP、DHCP等高级特性

### 悬停提示
- 鼠标悬停显示命令说明
- 提供配置示例和用法

## 支持的命令类型

### 基础配置
- 系统视图命令
- 接口配置命令
- VLAN配置命令

### 路由协议
- OSPF
- RIP
- 静态路由

### 安全特性
- ACL配置
- 流量过滤

### 高级特性
- STP生成树
- DHCP服务
- 端口聚合
- SNMP配置

## 使用方法

1. 创建以 `.cfg`、`.conf`、`.txt`、`.huawei` 或 `.h3c` 为扩展名的文件
2. 开始输入命令，会自动触发智能提示
3. 使用代码片段快速插入常用配置模板
4. 鼠标悬停在命令上查看说明

## 配置示例

```huawei
! 系统视图配置
system-view
sysname SW-1

! VLAN配置
vlan batch 10 20 30
interface GigabitEthernet0/0/1
 port link-type access
 port default vlan 10
 quit

! 接口IP配置
interface Vlanif10
 ip address 192.168.1.1 255.255.255.0
 quit

! OSPF配置
ospf 1
 area 0
  network 192.168.1.0 0.0.0.255
  quit
 quit

! 保存配置
save
y
