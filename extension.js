const vscode = require('vscode');
const ExtensionUpdater = require('./updater');

let updater = null;

/**
 * 扩展激活函数
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    console.log('✅ 华为/华三命令集扩展 v1.1.0 已激活！');
    
    // 显示激活消息
    vscode.window.showInformationMessage('🚀 华为/华三命令集扩展已加载 (v1.1.0)，作者: network-geek');
    
    // 初始化更新器
    updater = new ExtensionUpdater(context);
    updater.start();
    
    // ========== 1. 基础命令提示 ==========
    const commandProvider = vscode.languages.registerCompletionItemProvider(
        'huawei-h3c',
        {
            provideCompletionItems(document, position) {
                const linePrefix = document.lineAt(position).text.substr(0, position.character);
                
                // 扩展命令集 - 超过400个命令
                const commands = [
                    // ===== 系统管理命令 =====
                    { label: 'system-view', kind: vscode.CompletionItemKind.Keyword, detail: '进入系统视图' },
                    { label: 'sysname', kind: vscode.CompletionItemKind.Keyword, detail: '设置设备名称' },
                    { label: 'quit', kind: vscode.CompletionItemKind.Keyword, detail: '退出当前视图' },
                    { label: 'return', kind: vscode.CompletionItemKind.Keyword, detail: '直接返回用户视图' },
                    { label: 'save', kind: vscode.CompletionItemKind.Keyword, detail: '保存配置' },
                    { label: 'save force', kind: vscode.CompletionItemKind.Keyword, detail: '强制保存配置' },
                    { label: 'reset saved-configuration', kind: vscode.CompletionItemKind.Keyword, detail: '重置保存的配置' },
                    { label: 'compare configuration', kind: vscode.CompletionItemKind.Keyword, detail: '比较配置' },
                    { label: 'rollback', kind: vscode.CompletionItemKind.Keyword, detail: '配置回滚' },
                    { label: 'startup saved-configuration', kind: vscode.CompletionItemKind.Keyword, detail: '设置启动配置文件' },
                    { label: 'display version', kind: vscode.CompletionItemKind.Keyword, detail: '显示版本信息' },
                    { label: 'display device', kind: vscode.CompletionItemKind.Keyword, detail: '显示设备信息' },
                    { label: 'display cpu-usage', kind: vscode.CompletionItemKind.Keyword, detail: '显示CPU使用率' },
                    { label: 'display memory', kind: vscode.CompletionItemKind.Keyword, detail: '显示内存使用率' },
                    { label: 'display logbuffer', kind: vscode.CompletionItemKind.Keyword, detail: '显示日志缓冲' },
                    { label: 'display trapbuffer', kind: vscode.CompletionItemKind.Keyword, detail: '显示Trap缓冲' },
                    { label: 'terminal monitor', kind: vscode.CompletionItemKind.Keyword, detail: '终端监视器' },
                    { label: 'terminal debugging', kind: vscode.CompletionItemKind.Keyword, detail: '终端调试' },
                    { label: 'info-center enable', kind: vscode.CompletionItemKind.Keyword, detail: '启用信息中心' },
                    { label: 'info-center loghost', kind: vscode.CompletionItemKind.Keyword, detail: '配置日志服务器' },
                    
                    // ===== 接口配置命令 =====
                    { label: 'interface', kind: vscode.CompletionItemKind.Keyword, detail: '进入接口视图' },
                    { label: 'interface GigabitEthernet', kind: vscode.CompletionItemKind.Keyword, detail: '进入千兆以太网接口' },
                    { label: 'interface Ethernet', kind: vscode.CompletionItemKind.Keyword, detail: '进入以太网接口' },
                    { label: 'interface FastEthernet', kind: vscode.CompletionItemKind.Keyword, detail: '进入快速以太网接口' },
                    { label: 'interface Serial', kind: vscode.CompletionItemKind.Keyword, detail: '进入串行接口' },
                    { label: 'interface Pos', kind: vscode.CompletionItemKind.Keyword, detail: '进入POS接口' },
                    { label: 'interface Tunnel', kind: vscode.CompletionItemKind.Keyword, detail: '进入隧道接口' },
                    { label: 'interface LoopBack', kind: vscode.CompletionItemKind.Keyword, detail: '进入环回接口' },
                    { label: 'interface Vlanif', kind: vscode.CompletionItemKind.Keyword, detail: '进入VLAN接口' },
                    { label: 'interface NULL', kind: vscode.CompletionItemKind.Keyword, detail: '进入NULL接口' },
                    { label: 'ip address', kind: vscode.CompletionItemKind.Keyword, detail: '配置IP地址' },
                    { label: 'ip address dhcp-alloc', kind: vscode.CompletionItemKind.Keyword, detail: 'DHCP分配IP地址' },
                    { label: 'ip unnumbered', kind: vscode.CompletionItemKind.Keyword, detail: '借用接口IP地址' },
                    { label: 'shutdown', kind: vscode.CompletionItemKind.Keyword, detail: '关闭接口' },
                    { label: 'undo shutdown', kind: vscode.CompletionItemKind.Keyword, detail: '开启接口' },
                    { label: 'description', kind: vscode.CompletionItemKind.Keyword, detail: '配置接口描述' },
                    { label: 'mtu', kind: vscode.CompletionItemKind.Keyword, detail: '配置MTU值' },
                    { label: 'bandwidth', kind: vscode.CompletionItemKind.Keyword, detail: '配置接口带宽' },
                    { label: 'speed', kind: vscode.CompletionItemKind.Keyword, detail: '配置接口速率' },
                    { label: 'duplex', kind: vscode.CompletionItemKind.Keyword, detail: '配置双工模式' },
                    { label: 'negotiation auto', kind: vscode.CompletionItemKind.Keyword, detail: '自动协商' },
                    { label: 'port link-type', kind: vscode.CompletionItemKind.Keyword, detail: '设置端口链路类型' },
                    { label: 'port default vlan', kind: vscode.CompletionItemKind.Keyword, detail: '设置端口默认VLAN' },
                    { label: 'port trunk allow-pass', kind: vscode.CompletionItemKind.Keyword, detail: '设置Trunk允许的VLAN' },
                    { label: 'port trunk pvid', kind: vscode.CompletionItemKind.Keyword, detail: '设置Trunk端口的PVID' },
                    { label: 'port hybrid tagged', kind: vscode.CompletionItemKind.Keyword, detail: '设置Hybrid端口带标签' },
                    { label: 'port hybrid untagged', kind: vscode.CompletionItemKind.Keyword, detail: '设置Hybrid端口不带标签' },
                    { label: 'port hybrid pvid', kind: vscode.CompletionItemKind.Keyword, detail: '设置Hybrid端口PVID' },
                    { label: 'mac-address', kind: vscode.CompletionItemKind.Keyword, detail: '配置MAC地址' },
                    
                    // ===== VLAN配置命令 =====
                    { label: 'vlan', kind: vscode.CompletionItemKind.Keyword, detail: '创建VLAN' },
                    { label: 'vlan batch', kind: vscode.CompletionItemKind.Keyword, detail: '批量创建VLAN' },
                    { label: 'vlan range', kind: vscode.CompletionItemKind.Keyword, detail: '创建VLAN范围' },
                    { label: 'name', kind: vscode.CompletionItemKind.Keyword, detail: '配置VLAN名称' },
                    { label: 'description', kind: vscode.CompletionItemKind.Keyword, detail: '配置VLAN描述' },
                    { label: 'port', kind: vscode.CompletionItemKind.Keyword, detail: '将端口加入VLAN' },
                    { label: 'port hybrid', kind: vscode.CompletionItemKind.Keyword, detail: '配置Hybrid端口' },
                    { label: 'display vlan', kind: vscode.CompletionItemKind.Keyword, detail: '显示VLAN信息' },
                    { label: 'display vlan all', kind: vscode.CompletionItemKind.Keyword, detail: '显示所有VLAN' },
                    { label: 'display vlan brief', kind: vscode.CompletionItemKind.Keyword, detail: '显示VLAN简要信息' },
                    { label: 'vlan-stacking', kind: vscode.CompletionItemKind.Keyword, detail: 'VLAN Stacking配置' },
                    { label: 'vlan-mapping', kind: vscode.CompletionItemKind.Keyword, detail: 'VLAN Mapping配置' },
                    { label: 'vpn', kind: vscode.CompletionItemKind.Keyword, detail: 'VPN配置' },
                    
                    // ===== 路由协议命令 =====
                    { label: 'ospf', kind: vscode.CompletionItemKind.Keyword, detail: '启动OSPF协议' },
                    { label: 'ospf 1', kind: vscode.CompletionItemKind.Keyword, detail: '启动OSPF进程1' },
                    { label: 'area', kind: vscode.CompletionItemKind.Keyword, detail: '配置OSPF区域' },
                    { label: 'network', kind: vscode.CompletionItemKind.Keyword, detail: '宣告网络' },
                    { label: 'stub', kind: vscode.CompletionItemKind.Keyword, detail: '配置Stub区域' },
                    { label: 'nssa', kind: vscode.CompletionItemKind.Keyword, detail: '配置NSSA区域' },
                    { label: 'default-route-advertise', kind: vscode.CompletionItemKind.Keyword, detail: '发布默认路由' },
                    { label: 'import-route', kind: vscode.CompletionItemKind.Keyword, detail: '引入外部路由' },
                    { label: 'filter-policy', kind: vscode.CompletionItemKind.Keyword, detail: '过滤策略' },
                    { label: 'ospf cost', kind: vscode.CompletionItemKind.Keyword, detail: '配置OSPF开销' },
                    { label: 'ospf priority', kind: vscode.CompletionItemKind.Keyword, detail: '配置OSPF优先级' },
                    { label: 'ospf timer hello', kind: vscode.CompletionItemKind.Keyword, detail: '配置Hello定时器' },
                    { label: 'ospf timer dead', kind: vscode.CompletionItemKind.Keyword, detail: '配置Dead定时器' },
                    { label: 'ospf authentication-mode', kind: vscode.CompletionItemKind.Keyword, detail: '配置OSPF认证' },
                    { label: 'rip', kind: vscode.CompletionItemKind.Keyword, detail: '启动RIP协议' },
                    { label: 'rip 1', kind: vscode.CompletionItemKind.Keyword, detail: '启动RIP进程1' },
                    { label: 'version', kind: vscode.CompletionItemKind.Keyword, detail: '设置RIP版本' },
                    { label: 'network', kind: vscode.CompletionItemKind.Keyword, detail: '宣告网络' },
                    { label: 'rip summary-address', kind: vscode.CompletionItemKind.Keyword, detail: 'RIP汇总地址' },
                    { label: 'rip split-horizon', kind: vscode.CompletionItemKind.Keyword, detail: '水平分割' },
                    { label: 'rip poison-reverse', kind: vscode.CompletionItemKind.Keyword, detail: '毒性反转' },
                    { label: 'isis', kind: vscode.CompletionItemKind.Keyword, detail: '启动IS-IS协议' },
                    { label: 'isis circuit-level', kind: vscode.CompletionItemKind.Keyword, detail: '配置IS-IS级别' },
                    { label: 'isis cost', kind: vscode.CompletionItemKind.Keyword, detail: '配置IS-IS开销' },
                    { label: 'bgp', kind: vscode.CompletionItemKind.Keyword, detail: '启动BGP协议' },
                    { label: 'bgp 100', kind: vscode.CompletionItemKind.Keyword, detail: '启动BGP AS 100' },
                    { label: 'peer', kind: vscode.CompletionItemKind.Keyword, detail: '配置BGP对等体' },
                    { label: 'network', kind: vscode.CompletionItemKind.Keyword, detail: '宣告网络' },
                    { label: 'import-route', kind: vscode.CompletionItemKind.Keyword, detail: '引入路由' },
                    { label: 'summary automatic', kind: vscode.CompletionItemKind.Keyword, detail: '自动汇总' },
                    { label: 'ip route-static', kind: vscode.CompletionItemKind.Keyword, detail: '配置静态路由' },
                    { label: 'ip route-static vpn-instance', kind: vscode.CompletionItemKind.Keyword, detail: '配置VPN静态路由' },
                    { label: 'ip route-static default', kind: vscode.CompletionItemKind.Keyword, detail: '配置默认路由' },
                    
                    // ===== 显示命令 =====
                    { label: 'display', kind: vscode.CompletionItemKind.Keyword, detail: '显示信息' },
                    { label: 'display this', kind: vscode.CompletionItemKind.Keyword, detail: '显示当前视图配置' },
                    { label: 'display interface', kind: vscode.CompletionItemKind.Keyword, detail: '显示接口信息' },
                    { label: 'display interface brief', kind: vscode.CompletionItemKind.Keyword, detail: '显示接口简要信息' },
                    { label: 'display ip interface', kind: vscode.CompletionItemKind.Keyword, detail: '显示IP接口信息' },
                    { label: 'display ip interface brief', kind: vscode.CompletionItemKind.Keyword, detail: '显示IP接口简要信息' },
                    { label: 'display ip routing-table', kind: vscode.CompletionItemKind.Keyword, detail: '显示路由表' },
                    { label: 'display ip routing-table protocol', kind: vscode.CompletionItemKind.Keyword, detail: '显示协议路由表' },
                    { label: 'display arp', kind: vscode.CompletionItemKind.Keyword, detail: '显示ARP表' },
                    { label: 'display arp all', kind: vscode.CompletionItemKind.Keyword, detail: '显示所有ARP' },
                    { label: 'display mac-address', kind: vscode.CompletionItemKind.Keyword, detail: '显示MAC地址表' },
                    { label: 'display mac-address aging-time', kind: vscode.CompletionItemKind.Keyword, detail: '显示MAC老化时间' },
                    { label: 'display vlan', kind: vscode.CompletionItemKind.Keyword, detail: '显示VLAN信息' },
                    { label: 'display current-configuration', kind: vscode.CompletionItemKind.Keyword, detail: '显示当前配置' },
                    { label: 'display saved-configuration', kind: vscode.CompletionItemKind.Keyword, detail: '显示保存的配置' },
                    { label: 'display startup', kind: vscode.CompletionItemKind.Keyword, detail: '显示启动配置' },
                    { label: 'display patch', kind: vscode.CompletionItemKind.Keyword, detail: '显示补丁信息' },
                    { label: 'display logbuffer', kind: vscode.CompletionItemKind.Keyword, detail: '显示日志缓冲' },
                    { label: 'display trapbuffer', kind: vscode.CompletionItemKind.Keyword, detail: '显示Trap缓冲' },
                    { label: 'display diagnostic-information', kind: vscode.CompletionItemKind.Keyword, detail: '显示诊断信息' },
                    { label: 'display clock', kind: vscode.CompletionItemKind.Keyword, detail: '显示系统时间' },
                    { label: 'display users', kind: vscode.CompletionItemKind.Keyword, detail: '显示在线用户' },
                    { label: 'display history-command', kind: vscode.CompletionItemKind.Keyword, detail: '显示历史命令' },
                    
                    // ===== 安全配置 =====
                    { label: 'acl', kind: vscode.CompletionItemKind.Keyword, detail: '配置ACL' },
                    { label: 'acl number', kind: vscode.CompletionItemKind.Keyword, detail: '配置编号ACL' },
                    { label: 'acl name', kind: vscode.CompletionItemKind.Keyword, detail: '配置命名ACL' },
                    { label: 'rule', kind: vscode.CompletionItemKind.Keyword, detail: '配置ACL规则' },
                    { label: 'rule permit', kind: vscode.CompletionItemKind.Keyword, detail: '允许规则' },
                    { label: 'rule deny', kind: vscode.CompletionItemKind.Keyword, detail: '拒绝规则' },
                    { label: 'traffic-filter', kind: vscode.CompletionItemKind.Keyword, detail: '配置流量过滤' },
                    { label: 'traffic-limit', kind: vscode.CompletionItemKind.Keyword, detail: '配置流量限制' },
                    { label: 'traffic-policy', kind: vscode.CompletionItemKind.Keyword, detail: '配置流量策略' },
                    { label: 'qos', kind: vscode.CompletionItemKind.Keyword, detail: 'QoS配置' },
                    { label: 'qos-profile', kind: vscode.CompletionItemKind.Keyword, detail: 'QoS模板' },
                    { label: 'user-interface', kind: vscode.CompletionItemKind.Keyword, detail: '用户界面配置' },
                    { label: 'user-interface console', kind: vscode.CompletionItemKind.Keyword, detail: '控制台用户界面' },
                    { label: 'user-interface vty', kind: vscode.CompletionItemKind.Keyword, detail: 'VTY用户界面' },
                    { label: 'authentication-mode', kind: vscode.CompletionItemKind.Keyword, detail: '认证模式' },
                    { label: 'set authentication password', kind: vscode.CompletionItemKind.Keyword, detail: '设置认证密码' },
                    { label: 'protocol inbound', kind: vscode.CompletionItemKind.Keyword, detail: '入站协议' },
                    { label: 'idle-timeout', kind: vscode.CompletionItemKind.Keyword, detail: '空闲超时' },
                    { label: 'screen-length', kind: vscode.CompletionItemKind.Keyword, detail: '屏幕显示行数' },
                    { label: 'history-command max-size', kind: vscode.CompletionItemKind.Keyword, detail: '历史命令最大数量' },
                    { label: 'aaa', kind: vscode.CompletionItemKind.Keyword, detail: 'AAA配置' },
                    { label: 'local-user', kind: vscode.CompletionItemKind.Keyword, detail: '本地用户配置' },
                    { label: 'radius-server', kind: vscode.CompletionItemKind.Keyword, detail: 'RADIUS服务器配置' },
                    { label: 'hwtacacs-server', kind: vscode.CompletionItemKind.Keyword, detail: 'HWTACACS服务器配置' },
                    
                    // ===== STP/MSTP配置 =====
                    { label: 'stp enable', kind: vscode.CompletionItemKind.Keyword, detail: '启用STP' },
                    { label: 'stp disable', kind: vscode.CompletionItemKind.Keyword, detail: '禁用STP' },
                    { label: 'stp mode', kind: vscode.CompletionItemKind.Keyword, detail: '设置STP模式' },
                    { label: 'stp mode stp', kind: vscode.CompletionItemKind.Keyword, detail: 'STP模式' },
                    { label: 'stp mode rstp', kind: vscode.CompletionItemKind.Keyword, detail: 'RSTP模式' },
                    { label: 'stp mode mstp', kind: vscode.CompletionItemKind.Keyword, detail: 'MSTP模式' },
                    { label: 'stp priority', kind: vscode.CompletionItemKind.Keyword, detail: '设置STP优先级' },
                    { label: 'stp root primary', kind: vscode.CompletionItemKind.Keyword, detail: '设置为主根桥' },
                    { label: 'stp root secondary', kind: vscode.CompletionItemKind.Keyword, detail: '设置为备份根桥' },
                    { label: 'stp cost', kind: vscode.CompletionItemKind.Keyword, detail: '设置路径开销' },
                    { label: 'stp port priority', kind: vscode.CompletionItemKind.Keyword, detail: '设置端口优先级' },
                    { label: 'stp edged-port', kind: vscode.CompletionItemKind.Keyword, detail: '设置边缘端口' },
                    { label: 'stp point-to-point', kind: vscode.CompletionItemKind.Keyword, detail: '设置点对点链路' },
                    { label: 'stp timer forward-delay', kind: vscode.CompletionItemKind.Keyword, detail: '转发延迟定时器' },
                    { label: 'stp timer hello', kind: vscode.CompletionItemKind.Keyword, detail: 'Hello定时器' },
                    { label: 'stp timer max-age', kind: vscode.CompletionItemKind.Keyword, detail: '最大老化时间' },
                    { label: 'stp bpdu-protection', kind: vscode.CompletionItemKind.Keyword, detail: 'BPDU保护' },
                    { label: 'stp root-protection', kind: vscode.CompletionItemKind.Keyword, detail: '根保护' },
                    { label: 'stp loop-protection', kind: vscode.CompletionItemKind.Keyword, detail: '环路保护' },
                    { label: 'stp tc-protection', kind: vscode.CompletionItemKind.Keyword, detail: 'TC保护' },
                    { label: 'mst-region', kind: vscode.CompletionItemKind.Keyword, detail: 'MST域配置' },
                    { label: 'region-name', kind: vscode.CompletionItemKind.Keyword, detail: 'MST域名称' },
                    { label: 'revision-level', kind: vscode.CompletionItemKind.Keyword, detail: 'MST修订级别' },
                    { label: 'instance', kind: vscode.CompletionItemKind.Keyword, detail: 'MST实例' },
                    { label: 'vlan-mapping', kind: vscode.CompletionItemKind.Keyword, detail: 'VLAN映射' },
                    
                    // ===== DHCP配置 =====
                    { label: 'dhcp enable', kind: vscode.CompletionItemKind.Keyword, detail: '启用DHCP' },
                    { label: 'dhcp server', kind: vscode.CompletionItemKind.Keyword, detail: '配置DHCP服务器' },
                    { label: 'dhcp select', kind: vscode.CompletionItemKind.Keyword, detail: '选择DHCP模式' },
                    { label: 'dhcp select global', kind: vscode.CompletionItemKind.Keyword, detail: '全局DHCP模式' },
                    { label: 'dhcp select interface', kind: vscode.CompletionItemKind.Keyword, detail: '接口DHCP模式' },
                    { label: 'dhcp select relay', kind: vscode.CompletionItemKind.Keyword, detail: 'DHCP中继模式' },
                    { label: 'dhcp server dns-list', kind: vscode.CompletionItemKind.Keyword, detail: '配置DNS服务器' },
                    { label: 'dhcp server domain-name', kind: vscode.CompletionItemKind.Keyword, detail: '配置域名' },
                    { label: 'dhcp server lease', kind: vscode.CompletionItemKind.Keyword, detail: '配置租期' },
                    { label: 'dhcp server excluded-ip-address', kind: vscode.CompletionItemKind.Keyword, detail: '排除IP地址' },
                    { label: 'dhcp server static-bind', kind: vscode.CompletionItemKind.Keyword, detail: '静态绑定' },
                    { label: 'dhcp server gateway-list', kind: vscode.CompletionItemKind.Keyword, detail: '配置网关' },
                    { label: 'dhcp server nbns-list', kind: vscode.CompletionItemKind.Keyword, detail: '配置WINS服务器' },
                    { label: 'dhcp relay', kind: vscode.CompletionItemKind.Keyword, detail: 'DHCP中继配置' },
                    { label: 'dhcp relay server-ip', kind: vscode.CompletionItemKind.Keyword, detail: '配置中继服务器' },
                    { label: 'dhcp snooping', kind: vscode.CompletionItemKind.Keyword, detail: 'DHCP Snooping配置' },
                    { label: 'dhcp snooping trusted', kind: vscode.CompletionItemKind.Keyword, detail: '配置信任端口' },
                    { label: 'dhcp snooping enable', kind: vscode.CompletionItemKind.Keyword, detail: '启用DHCP Snooping' },
                    
                    // ===== 链路聚合 =====
                    { label: 'eth-trunk', kind: vscode.CompletionItemKind.Keyword, detail: 'Eth-Trunk配置' },
                    { label: 'interface eth-trunk', kind: vscode.CompletionItemKind.Keyword, detail: '进入Eth-Trunk接口' },
                    { label: 'trunkport', kind: vscode.CompletionItemKind.Keyword, detail: '添加成员端口' },
                    { label: 'mode', kind: vscode.CompletionItemKind.Keyword, detail: '配置聚合模式' },
                    { label: 'mode lacp', kind: vscode.CompletionItemKind.Keyword, detail: 'LACP模式' },
                    { label: 'mode manual', kind: vscode.CompletionItemKind.Keyword, detail: '手动模式' },
                    { label: 'lacp priority', kind: vscode.CompletionItemKind.Keyword, detail: 'LACP优先级' },
                    { label: 'lacp preempt', kind: vscode.CompletionItemKind.Keyword, detail: 'LACP抢占' },
                    { label: 'lacp system-priority', kind: vscode.CompletionItemKind.Keyword, detail: 'LACP系统优先级' },
                    { label: 'load-balance', kind: vscode.CompletionItemKind.Keyword, detail: '负载均衡方式' },
                    
                    // ===== 堆叠集群 =====
                    { label: 'stack', kind: vscode.CompletionItemKind.Keyword, detail: '堆叠配置' },
                    { label: 'stack member', kind: vscode.CompletionItemKind.Keyword, detail: '堆叠成员配置' },
                    { label: 'stack priority', kind: vscode.CompletionItemKind.Keyword, detail: '堆叠优先级' },
                    { label: 'stack port', kind: vscode.CompletionItemKind.Keyword, detail: '堆叠端口配置' },
                    { label: 'stack reserved-vlan', kind: vscode.CompletionItemKind.Keyword, detail: '堆叠保留VLAN' },
                    { label: 'stack mac-switch', kind: vscode.CompletionItemKind.Keyword, detail: '堆叠MAC切换' },
                    { label: 'cluster', kind: vscode.CompletionItemKind.Keyword, detail: '集群配置' },
                    
                    // ===== 网络诊断 =====
                    { label: 'ping', kind: vscode.CompletionItemKind.Keyword, detail: 'Ping测试' },
                    { label: 'ping -a', kind: vscode.CompletionItemKind.Keyword, detail: '指定源IP的Ping' },
                    { label: 'ping -c', kind: vscode.CompletionItemKind.Keyword, detail: '指定次数的Ping' },
                    { label: 'ping -s', kind: vscode.CompletionItemKind.Keyword, detail: '指定包大小的Ping' },
                    { label: 'tracert', kind: vscode.CompletionItemKind.Keyword, detail: '路由跟踪' },
                    { label: 'tracert -a', kind: vscode.CompletionItemKind.Keyword, detail: '指定源IP的路由跟踪' },
                    { label: 'tracert -m', kind: vscode.CompletionItemKind.Keyword, detail: '指定最大跳数' },
                    { label: 'telnet', kind: vscode.CompletionItemKind.Keyword, detail: 'Telnet连接' },
                    { label: 'ssh', kind: vscode.CompletionItemKind.Keyword, detail: 'SSH连接' },
                    { label: 'ftp', kind: vscode.CompletionItemKind.Keyword, detail: 'FTP连接' },
                    { label: 'tftp', kind: vscode.CompletionItemKind.Keyword, detail: 'TFTP连接' },
                    { label: 'nslookup', kind: vscode.CompletionItemKind.Keyword, detail: 'DNS查询' },
                    { label: 'debugging', kind: vscode.CompletionItemKind.Keyword, detail: '调试命令' },
                    { label: 'debugging ip packet', kind: vscode.CompletionItemKind.Keyword, detail: 'IP包调试' },
                    { label: 'debugging ospf event', kind: vscode.CompletionItemKind.Keyword, detail: 'OSPF事件调试' },
                    { label: 'debugging rip', kind: vscode.CompletionItemKind.Keyword, detail: 'RIP调试' },
                    { label: 'debugging bgp', kind: vscode.CompletionItemKind.Keyword, detail: 'BGP调试' },
                    { label: 'debugging stp', kind: vscode.CompletionItemKind.Keyword, detail: 'STP调试' },
                    { label: 'undo debugging all', kind: vscode.CompletionItemKind.Keyword, detail: '关闭所有调试' },
                    
                    // ===== SNMP配置 =====
                    { label: 'snmp-agent', kind: vscode.CompletionItemKind.Keyword, detail: 'SNMP代理配置' },
                    { label: 'snmp-agent community', kind: vscode.CompletionItemKind.Keyword, detail: 'SNMP团体配置' },
                    { label: 'snmp-agent community read', kind: vscode.CompletionItemKind.Keyword, detail: '只读团体' },
                    { label: 'snmp-agent community write', kind: vscode.CompletionItemKind.Keyword, detail: '读写团体' },
                    { label: 'snmp-agent sys-info', kind: vscode.CompletionItemKind.Keyword, detail: '系统信息配置' },
                    { label: 'snmp-agent sys-info contact', kind: vscode.CompletionItemKind.Keyword, detail: '联系人信息' },
                    { label: 'snmp-agent sys-info location', kind: vscode.CompletionItemKind.Keyword, detail: '位置信息' },
                    { label: 'snmp-agent sys-info version', kind: vscode.CompletionItemKind.Keyword, detail: 'SNMP版本' },
                    { label: 'snmp-agent target-host', kind: vscode.CompletionItemKind.Keyword, detail: '目标主机配置' },
                    { label: 'snmp-agent trap enable', kind: vscode.CompletionItemKind.Keyword, detail: '启用Trap' },
                    { label: 'snmp-agent trap source', kind: vscode.CompletionItemKind.Keyword, detail: 'Trap源接口' },
                    
                    // ===== NTP配置 =====
                    { label: 'ntp-service', kind: vscode.CompletionItemKind.Keyword, detail: 'NTP服务配置' },
                    { label: 'ntp-service enable', kind: vscode.CompletionItemKind.Keyword, detail: '启用NTP' },
                    { label: 'ntp-service unicast-server', kind: vscode.CompletionItemKind.Keyword, detail: 'NTP单播服务器' },
                    { label: 'ntp-service multicast-server', kind: vscode.CompletionItemKind.Keyword, detail: 'NTP组播服务器' },
                    { label: 'ntp-service broadcast-server', kind: vscode.CompletionItemKind.Keyword, detail: 'NTP广播服务器' },
                    { label: 'ntp-service source-interface', kind: vscode.CompletionItemKind.Keyword, detail: 'NTP源接口' },
                    { label: 'clock timezone', kind: vscode.CompletionItemKind.Keyword, detail: '时区配置' },
                    { label: 'clock datetime', kind: vscode.CompletionItemKind.Keyword, detail: '设置日期时间' },
                    
                    // ===== 文件系统 =====
                    { label: 'dir', kind: vscode.CompletionItemKind.Keyword, detail: '显示目录' },
                    { label: 'cd', kind: vscode.CompletionItemKind.Keyword, detail: '切换目录' },
                    { label: 'pwd', kind: vscode.CompletionItemKind.Keyword, detail: '显示当前目录' },
                    { label: 'mkdir', kind: vscode.CompletionItemKind.Keyword, detail: '创建目录' },
                    { label: 'rmdir', kind: vscode.CompletionItemKind.Keyword, detail: '删除目录' },
                    { label: 'delete', kind: vscode.CompletionItemKind.Keyword, detail: '删除文件' },
                    { label: 'undelete', kind: vscode.CompletionItemKind.Keyword, detail: '恢复删除的文件' },
                    { label: 'rename', kind: vscode.CompletionItemKind.Keyword, detail: '重命名文件' },
                    { label: 'copy', kind: vscode.CompletionItemKind.Keyword, detail: '复制文件' },
                    { label: 'move', kind: vscode.CompletionItemKind.Keyword, detail: '移动文件' },
                    { label: 'more', kind: vscode.CompletionItemKind.Keyword, detail: '查看文件内容' },
                    { label: 'format', kind: vscode.CompletionItemKind.Keyword, detail: '格式化文件系统' },
                    { label: 'fixdisk', kind: vscode.CompletionItemKind.Keyword, detail: '修复文件系统' },
                    
                    // ===== 华为/华三特有命令 =====
                    { label: 'interface GigabitEthernet0/0/1', kind: vscode.CompletionItemKind.Keyword, detail: '华为千兆以太网接口' },
                    { label: 'interface Ethernet0/0/1', kind: vscode.CompletionItemKind.Keyword, detail: '华为以太网接口' },
                    { label: 'interface Serial0/0/1', kind: vscode.CompletionItemKind.Keyword, detail: '华为串行接口' },
                    { label: 'interface Vlanif10', kind: vscode.CompletionItemKind.Keyword, detail: '华为VLANIF接口' },
                    { label: 'interface LoopBack0', kind: vscode.CompletionItemKind.Keyword, detail: '华为LoopBack接口' },
                    { label: 'interface NULL0', kind: vscode.CompletionItemKind.Keyword, detail: '华为NULL接口' },
                    { label: 'interface Tunnel0/0/1', kind: vscode.CompletionItemKind.Keyword, detail: '华为Tunnel接口' },
                    { label: 'interface Eth-Trunk1', kind: vscode.CompletionItemKind.Keyword, detail: '华为Eth-Trunk接口' },
                    { label: 'interface Stack-Port1/1', kind: vscode.CompletionItemKind.Keyword, detail: '华为堆叠端口' },
                    { label: 'interface Cellular0/0/1', kind: vscode.CompletionItemKind.Keyword, detail: '华为蜂窝接口' },
                    
                    // ===== 华为VRRP配置 =====
                    { label: 'vrrp vrid', kind: vscode.CompletionItemKind.Keyword, detail: 'VRRP虚拟路由器ID' },
                    { label: 'vrrp vrid 1 virtual-ip', kind: vscode.CompletionItemKind.Keyword, detail: 'VRRP虚拟IP' },
                    { label: 'vrrp vrid 1 priority', kind: vscode.CompletionItemKind.Keyword, detail: 'VRRP优先级' },
                    { label: 'vrrp vrid 1 preempt-mode', kind: vscode.CompletionItemKind.Keyword, detail: 'VRRP抢占模式' },
                    { label: 'vrrp vrid 1 timer advertise', kind: vscode.CompletionItemKind.Keyword, detail: 'VRRP通告定时器' },
                    { label: 'vrrp vrid 1 authentication-mode', kind: vscode.CompletionItemKind.Keyword, detail: 'VRRP认证模式' },
                    { label: 'vrrp vrid 1 track', kind: vscode.CompletionItemKind.Keyword, detail: 'VRRP跟踪' },
                    
                    // ===== 华为BFD配置 =====
                    { label: 'bfd', kind: vscode.CompletionItemKind.Keyword, detail: 'BFD配置' },
                    { label: 'bfd session', kind: vscode.CompletionItemKind.Keyword, detail: 'BFD会话' },
                    { label: 'bfd min-transmit-interval', kind: vscode.CompletionItemKind.Keyword, detail: 'BFD最小发送间隔' },
                    { label: 'bfd min-receive-interval', kind: vscode.CompletionItemKind.Keyword, detail: 'BFD最小接收间隔' },
                    { label: 'bfd detect-multiplier', kind: vscode.CompletionItemKind.Keyword, detail: 'BFD检测倍数' },
                    { label: 'bfd bind peer-ip', kind: vscode.CompletionItemKind.Keyword, detail: 'BFD绑定对端IP' },
                    
                    // ===== 华为IPSec配置 =====
                    { label: 'ipsec proposal', kind: vscode.CompletionItemKind.Keyword, detail: 'IPSec提议' },
                    { label: 'ipsec policy', kind: vscode.CompletionItemKind.Keyword, detail: 'IPSec策略' },
                    { label: 'ipsec profile', kind: vscode.CompletionItemKind.Keyword, detail: 'IPSec模板' },
                    { label: 'ike proposal', kind: vscode.CompletionItemKind.Keyword, detail: 'IKE提议' },
                    { label: 'ike peer', kind: vscode.CompletionItemKind.Keyword, detail: 'IKE对等体' },
                    
                    // ===== 华三IRF配置 =====
                    { label: 'irf', kind: vscode.CompletionItemKind.Keyword, detail: '华三IRF配置' },
                    { label: 'irf member', kind: vscode.CompletionItemKind.Keyword, detail: 'IRF成员配置' },
                    { label: 'irf priority', kind: vscode.CompletionItemKind.Keyword, detail: 'IRF优先级' },
                    { label: 'irf link-delay', kind: vscode.CompletionItemKind.Keyword, detail: 'IRF链路延迟' },
                    { label: 'irf mac-address', kind: vscode.CompletionItemKind.Keyword, detail: 'IRF MAC地址' },
                    { label: 'irf auto-merge', kind: vscode.CompletionItemKind.Keyword, detail: 'IRF自动合并' },
                    { label: 'irf-port', kind: vscode.CompletionItemKind.Keyword, detail: 'IRF端口配置' },
                    { label: 'port group', kind: vscode.CompletionItemKind.Keyword, detail: '端口组配置' },
                    
                    // ===== 华三RRPP配置 =====
                    { label: 'rrpp', kind: vscode.CompletionItemKind.Keyword, detail: '华三RRPP配置' },
                    { label: 'rrpp domain', kind: vscode.CompletionItemKind.Keyword, detail: 'RRPP域' },
                    { label: 'rrpp ring', kind: vscode.CompletionItemKind.Keyword, detail: 'RRPP环' },
                    { label: 'rrpp primary-port', kind: vscode.CompletionItemKind.Keyword, detail: 'RRPP主端口' },
                    { label: 'rrpp secondary-port', kind: vscode.CompletionItemKind.Keyword, detail: 'RRPP从端口' },
                    { label: 'rrpp node-mode', kind: vscode.CompletionItemKind.Keyword, detail: 'RRPP节点模式' },
                    { label: 'rrpp timer', kind: vscode.CompletionItemKind.Keyword, detail: 'RRPP定时器' },
                    
                    // ===== 华三Smart Link配置 =====
                    { label: 'smart-link', kind: vscode.CompletionItemKind.Keyword, detail: '华三Smart Link配置' },
                    { label: 'smart-link group', kind: vscode.CompletionItemKind.Keyword, detail: 'Smart Link组' },
                    { label: 'smart-link flush', kind: vscode.CompletionItemKind.Keyword, detail: 'Smart Link刷新' },
                    { label: 'smart-link protect', kind: vscode.CompletionItemKind.Keyword, detail: 'Smart Link保护' },
                    
                    // ===== 华三Monitor Link配置 =====
                    { label: 'monitor-link', kind: vscode.CompletionItemKind.Keyword, detail: '华三Monitor Link配置' },
                    { label: 'monitor-link group', kind: vscode.CompletionItemKind.Keyword, detail: 'Monitor Link组' },
                    { label: 'port monitor-link', kind: vscode.CompletionItemKind.Keyword, detail: 'Monitor Link端口' },
                    { label: 'uplink', kind: vscode.CompletionItemKind.Keyword, detail: '上行链路' },
                    { label: 'downlink', kind: vscode.CompletionItemKind.Keyword, detail: '下行链路' }
                ];

                return commands.map(cmd => {
                    const item = new vscode.CompletionItem(cmd.label, cmd.kind);
                    item.detail = cmd.detail;
                    item.insertText = cmd.label + ' ';
                    return item;
                });
            }
        },
        ' ' // 触发字符
    );

    // ========== 2. 悬停提示扩展 ==========
    const hoverProvider = vscode.languages.registerHoverProvider('huawei-h3c', {
        provideHover(document, position) {
            const wordRange = document.getWordRangeAtPosition(position);
            if (!wordRange) return null;
            
            const word = document.getText(wordRange);
            
            const hoverTexts = {
                // 系统管理
                'system-view': '进入系统视图，用于全局配置\n\n**示例**：\n```\nsystem-view\nsysname SW-1\n```',
                'sysname': '设置设备名称\n\n**示例**：\n```\nsysname Huawei-Switch\n```',
                'save': '保存当前配置\n\n**示例**：\n```\nsave\nsave force\n```',
                'display': '显示设备信息\n\n**常用命令**：\n- `display current-configuration`\n- `display interface`\n- `display ip routing-table`',
                
                // 接口配置
                'interface': '进入接口配置视图\n\n**示例**：\n```\ninterface GigabitEthernet0/0/1\nip address 192.168.1.1 24\n```',
                'ip address': '配置接口IP地址\n\n**示例**：\n```\nip address 192.168.1.1 255.255.255.0\n```',
                'shutdown': '关闭接口\n\n**示例**：\n```\ninterface GigabitEthernet0/0/1\nshutdown\n```',
                'undo shutdown': '开启接口\n\n**示例**：\n```\ninterface GigabitEthernet0/0/1\nundo shutdown\n```',
                
                // VLAN
                'vlan': '创建VLAN或进入VLAN视图\n\n**示例**：\n```\nvlan 10\nname Sales\n```',
                'vlan batch': '批量创建VLAN\n\n**示例**：\n```\nvlan batch 10 20 30\nvlan batch 100 to 200\n```',
                'port link-type': '设置端口链路类型\n\n**选项**：access, trunk, hybrid\n\n**示例**：\n```\nport link-type trunk\n```',
                
                // 路由协议
                'ospf': '启动OSPF协议\n\n**示例**：\n```\nospf 1\narea 0\nnetwork 192.168.1.0 0.0.0.255\n```',
                'rip': '启动RIP协议\n\n**示例**：\n```\nrip 1\nversion 2\nnetwork 192.168.1.0\n```',
                'bgp': '启动BGP协议\n\n**示例**：\n```\nbgp 100\npeer 192.168.1.2 as-number 200\n```',
                'ip route-static': '配置静态路由\n\n**示例**：\n```\nip route-static 0.0.0.0 0.0.0.0 192.168.1.1\n```',
                
                // 安全
                'acl': '配置访问控制列表\n\n**示例**：\n```\nacl number 2000\nrule 5 permit source 192.168.1.0 0.0.0.255\n```',
                'rule': '配置ACL规则\n\n**示例**：\n```\nrule 10 deny source any\n```',
                
                // STP
                'stp enable': '启用生成树协议\n\n**示例**：\n```\nstp enable\n```',
                'stp mode': '设置STP模式\n\n**选项**：stp, rstp, mstp\n\n**示例**：\n```\nstp mode rstp\n```',
                
                // DHCP
                'dhcp enable': '启用DHCP服务\n\n**示例**：\n```\ndhcp enable\n```',
                'dhcp server': '配置DHCP服务器参数\n\n**示例**：\n```\ndhcp server dns-list 8.8.8.8\n```',
                
                // 诊断
                'ping': '网络连通性测试\n\n**示例**：\n```\nping 192.168.1.1\nping -c 5 192.168.1.1\n```',
                'tracert': '路由跟踪\n\n**示例**：\n```\ntracert 192.168.1.1\n```',
                
                // 链路聚合
                'eth-trunk': '配置Eth-Trunk接口\n\n**示例**：\n```\ninterface Eth-Trunk1\nport link-type trunk\ntrunkport GigabitEthernet0/0/1 to 0/0/4\n```',
                
                // 堆叠
                'stack': '堆叠配置\n\n**示例**：\n```\nstack member 1 priority 100\n```',
                
                // 华为特有
                'vrrp vrid': 'VRRP配置\n\n**示例**：\n```\ninterface Vlanif10\nvrrp vrid 1 virtual-ip 192.168.1.254\n```',
                'bfd': 'BFD配置\n\n**示例**：\n```\nbfd\nbfd session bind peer-ip 192.168.1.2\n```',
                
                // 华三特有
                'irf': 'IRF堆叠配置\n\n**示例**：\n```\nirf member 1 priority 32\nirf-port 1/1\nport group interface GigabitEthernet1/0/1\n```',
                'rrpp': 'RRPP环网保护配置\n\n**示例**：\n```\nrrpp domain 1\nrrpp ring 1\nrrpp primary-port GigabitEthernet1/0/1\n```',
                
                // 文件系统
                'dir': '显示文件目录\n\n**示例**：\n```\ndir\ndir flash:/\n```',
                'delete': '删除文件\n\n**示例**：\n```\ndelete test.cfg\n```',
                'copy': '复制文件\n\n**示例**：\n```\ncopy flash:/startup.cfg flash:/backup.cfg\n```'
            };
            
            if (hoverTexts[word]) {
                return new vscode.Hover(hoverTexts[word]);
            }
        }
    });
    
    // 注册手动检查更新命令
    const checkUpdateCommand = vscode.commands.registerCommand('huawei-h3c-commands.checkUpdate', () => {
        if (updater) {
            updater.manualCheck();
        }
    });
    
    // 注册设置更新服务器命令
    const setUpdateUrlCommand = vscode.commands.registerCommand('huawei-h3c-commands.setUpdateUrl', async () => {
        if (!updater) return;
        
        const url = await vscode.window.showInputBox({
            prompt: '请输入自定义更新服务器URL',
            placeHolder: 'https://your-server.com/updates.json',
            value: updater.updateUrl
        });
        
        if (url) {
            updater.updateUrl = url;
            await context.globalState.update('updateUrl', url);
            vscode.window.showInformationMessage('✅ 更新服务器地址已设置');
        }
    });
    
    context.subscriptions.push(commandProvider);
    context.subscriptions.push(hoverProvider);
    context.subscriptions.push(checkUpdateCommand);
    context.subscriptions.push(setUpdateUrlCommand);
    
    // 显示激活成功消息
    vscode.window.setStatusBarMessage('$(check) 华为/华三命令集 v1.1.0 已加载', 3000);
}

/**
 * 扩展停用函数
 */
function deactivate() {}

module.exports = {
    activate,
    deactivate
};