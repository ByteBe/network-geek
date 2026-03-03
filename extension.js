const vscode = require('vscode');
const ExtensionUpdater = require('./updater');

let updater = null;

/**
 * 扩展激活函数
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    console.log('✅ 华为/华三命令集扩展 v1.2.0 已激活！');
    
    // 显示激活消息
    vscode.window.showInformationMessage('🚀 华为/华三命令集扩展已加载 (v1.2.0，支持MPLS VPN和高级路由协议)，作者: network-geek');
    
    // 初始化更新器
    updater = new ExtensionUpdater(context);
    updater.start();
    
    // ========== 1. 基础命令提示 ==========
    const commandProvider = vscode.languages.registerCompletionItemProvider(
        'huawei-h3c',
        {
            provideCompletionItems(document, position) {
                const linePrefix = document.lineAt(position).text.substr(0, position.character);
                
                // 扩展命令集 - 超过700条命令
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
                    
                    // ===== OSPF路由协议扩展 =====
                    { label: 'ospf', kind: vscode.CompletionItemKind.Keyword, detail: '启动OSPF协议' },
                    { label: 'ospf 1 router-id', kind: vscode.CompletionItemKind.Keyword, detail: '配置OSPF Router ID' },
                    { label: 'ospf 1 vpn-instance', kind: vscode.CompletionItemKind.Keyword, detail: '配置OSPF VPN实例' },
                    { label: 'area', kind: vscode.CompletionItemKind.Keyword, detail: '配置OSPF区域' },
                    { label: 'area 0', kind: vscode.CompletionItemKind.Keyword, detail: '配置骨干区域' },
                    { label: 'area 0.0.0.0', kind: vscode.CompletionItemKind.Keyword, detail: '配置骨干区域（点分十进制）' },
                    { label: 'network', kind: vscode.CompletionItemKind.Keyword, detail: '宣告网络' },
                    { label: 'network 192.168.1.0 0.0.0.255', kind: vscode.CompletionItemKind.Keyword, detail: '宣告网络示例' },
                    { label: 'stub', kind: vscode.CompletionItemKind.Keyword, detail: '配置Stub区域' },
                    { label: 'stub no-summary', kind: vscode.CompletionItemKind.Keyword, detail: '配置完全Stub区域' },
                    { label: 'nssa', kind: vscode.CompletionItemKind.Keyword, detail: '配置NSSA区域' },
                    { label: 'nssa no-summary', kind: vscode.CompletionItemKind.Keyword, detail: '配置完全NSSA区域' },
                    { label: 'default-route-advertise', kind: vscode.CompletionItemKind.Keyword, detail: '发布默认路由' },
                    { label: 'default-route-advertise always', kind: vscode.CompletionItemKind.Keyword, detail: '始终发布默认路由' },
                    { label: 'import-route', kind: vscode.CompletionItemKind.Keyword, detail: '引入外部路由' },
                    { label: 'import-route direct', kind: vscode.CompletionItemKind.Keyword, detail: '引入直连路由' },
                    { label: 'import-route static', kind: vscode.CompletionItemKind.Keyword, detail: '引入静态路由' },
                    { label: 'import-route rip', kind: vscode.CompletionItemKind.Keyword, detail: '引入RIP路由' },
                    { label: 'import-route bgp', kind: vscode.CompletionItemKind.Keyword, detail: '引入BGP路由' },
                    { label: 'import-route isis', kind: vscode.CompletionItemKind.Keyword, detail: '引入ISIS路由' },
                    { label: 'filter-policy', kind: vscode.CompletionItemKind.Keyword, detail: '过滤策略' },
                    { label: 'filter-policy acl', kind: vscode.CompletionItemKind.Keyword, detail: 'ACL过滤策略' },
                    { label: 'ospf cost', kind: vscode.CompletionItemKind.Keyword, detail: '配置OSPF开销' },
                    { label: 'ospf cost 10', kind: vscode.CompletionItemKind.Keyword, detail: '配置OSPF开销为10' },
                    { label: 'ospf priority', kind: vscode.CompletionItemKind.Keyword, detail: '配置OSPF优先级' },
                    { label: 'ospf priority 100', kind: vscode.CompletionItemKind.Keyword, detail: '配置OSPF优先级为100' },
                    { label: 'ospf timer hello', kind: vscode.CompletionItemKind.Keyword, detail: '配置Hello定时器' },
                    { label: 'ospf timer hello 10', kind: vscode.CompletionItemKind.Keyword, detail: '配置Hello定时器为10秒' },
                    { label: 'ospf timer dead', kind: vscode.CompletionItemKind.Keyword, detail: '配置Dead定时器' },
                    { label: 'ospf timer dead 40', kind: vscode.CompletionItemKind.Keyword, detail: '配置Dead定时器为40秒' },
                    { label: 'ospf authentication-mode', kind: vscode.CompletionItemKind.Keyword, detail: '配置OSPF认证' },
                    { label: 'ospf authentication-mode md5', kind: vscode.CompletionItemKind.Keyword, detail: '配置MD5认证' },
                    { label: 'ospf authentication-mode simple', kind: vscode.CompletionItemKind.Keyword, detail: '配置明文认证' },
                    { label: 'ospf authentication-mode keychain', kind: vscode.CompletionItemKind.Keyword, detail: '配置Keychain认证' },
                    { label: 'ospf enable', kind: vscode.CompletionItemKind.Keyword, detail: '在接口启用OSPF' },
                    { label: 'ospf mtu-enable', kind: vscode.CompletionItemKind.Keyword, detail: '启用MTU检查' },
                    { label: 'ospf mtu-ignore', kind: vscode.CompletionItemKind.Keyword, detail: '忽略MTU检查' },
                    { label: 'ospf network-type', kind: vscode.CompletionItemKind.Keyword, detail: '配置网络类型' },
                    { label: 'ospf network-type broadcast', kind: vscode.CompletionItemKind.Keyword, detail: '配置广播网络' },
                    { label: 'ospf network-type p2p', kind: vscode.CompletionItemKind.Keyword, detail: '配置点对点网络' },
                    { label: 'ospf network-type p2mp', kind: vscode.CompletionItemKind.Keyword, detail: '配置点对多点网络' },
                    { label: 'ospf network-type nbma', kind: vscode.CompletionItemKind.Keyword, detail: '配置NBMA网络' },
                    { label: 'ospf dr-priority', kind: vscode.CompletionItemKind.Keyword, detail: '配置DR优先级' },
                    { label: 'ospf trans-delay', kind: vscode.CompletionItemKind.Keyword, detail: '配置传输延迟' },
                    { label: 'ospf retransmit-interval', kind: vscode.CompletionItemKind.Keyword, detail: '配置重传间隔' },
                    
                    // ===== RIP路由协议扩展 =====
                    { label: 'rip', kind: vscode.CompletionItemKind.Keyword, detail: '启动RIP协议' },
                    { label: 'rip 1', kind: vscode.CompletionItemKind.Keyword, detail: '启动RIP进程1' },
                    { label: 'version', kind: vscode.CompletionItemKind.Keyword, detail: '设置RIP版本' },
                    { label: 'version 2', kind: vscode.CompletionItemKind.Keyword, detail: '设置RIP版本2' },
                    { label: 'network', kind: vscode.CompletionItemKind.Keyword, detail: '宣告网络' },
                    { label: 'network 192.168.0.0', kind: vscode.CompletionItemKind.Keyword, detail: '宣告网络示例' },
                    { label: 'rip summary-address', kind: vscode.CompletionItemKind.Keyword, detail: 'RIP汇总地址' },
                    { label: 'rip split-horizon', kind: vscode.CompletionItemKind.Keyword, detail: '水平分割' },
                    { label: 'rip split-horizon enable', kind: vscode.CompletionItemKind.Keyword, detail: '启用水平分割' },
                    { label: 'rip split-horizon disable', kind: vscode.CompletionItemKind.Keyword, detail: '禁用水平分割' },
                    { label: 'rip poison-reverse', kind: vscode.CompletionItemKind.Keyword, detail: '毒性反转' },
                    { label: 'rip poison-reverse enable', kind: vscode.CompletionItemKind.Keyword, detail: '启用毒性反转' },
                    { label: 'rip authentication-mode', kind: vscode.CompletionItemKind.Keyword, detail: 'RIP认证模式' },
                    { label: 'rip authentication-mode md5', kind: vscode.CompletionItemKind.Keyword, detail: 'RIP MD5认证' },
                    { label: 'rip authentication-mode simple', kind: vscode.CompletionItemKind.Keyword, detail: 'RIP明文认证' },
                    { label: 'rip input', kind: vscode.CompletionItemKind.Keyword, detail: '启用RIP接收' },
                    { label: 'rip output', kind: vscode.CompletionItemKind.Keyword, detail: '启用RIP发送' },
                    { label: 'rip metricin', kind: vscode.CompletionItemKind.Keyword, detail: '配置入方向度量' },
                    { label: 'rip metricout', kind: vscode.CompletionItemKind.Keyword, detail: '配置出方向度量' },
                    { label: 'rip default-route', kind: vscode.CompletionItemKind.Keyword, detail: '发布默认路由' },
                    { label: 'rip default-route originate', kind: vscode.CompletionItemKind.Keyword, detail: '产生默认路由' },
                    { label: 'import-route direct', kind: vscode.CompletionItemKind.Keyword, detail: '引入直连路由' },
                    { label: 'import-route ospf', kind: vscode.CompletionItemKind.Keyword, detail: '引入OSPF路由' },
                    { label: 'import-route static', kind: vscode.CompletionItemKind.Keyword, detail: '引入静态路由' },
                    { label: 'import-route bgp', kind: vscode.CompletionItemKind.Keyword, detail: '引入BGP路由' },
                    { label: 'rip database', kind: vscode.CompletionItemKind.Keyword, detail: '显示RIP数据库' },
                    
                    // ===== ISIS路由协议扩展 =====
                    { label: 'isis', kind: vscode.CompletionItemKind.Keyword, detail: '启动IS-IS协议' },
                    { label: 'isis 1', kind: vscode.CompletionItemKind.Keyword, detail: '启动IS-IS进程1' },
                    { label: 'network-entity', kind: vscode.CompletionItemKind.Keyword, detail: '配置网络实体' },
                    { label: 'network-entity 49.0001.0010.0100.1001.00', kind: vscode.CompletionItemKind.Keyword, detail: '配置网络实体示例' },
                    { label: 'is-level', kind: vscode.CompletionItemKind.Keyword, detail: '配置IS级别' },
                    { label: 'is-level level-1', kind: vscode.CompletionItemKind.Keyword, detail: '配置Level-1路由器' },
                    { label: 'is-level level-2', kind: vscode.CompletionItemKind.Keyword, detail: '配置Level-2路由器' },
                    { label: 'is-level level-1-2', kind: vscode.CompletionItemKind.Keyword, detail: '配置Level-1-2路由器' },
                    { label: 'isis circuit-level', kind: vscode.CompletionItemKind.Keyword, detail: '配置接口级别' },
                    { label: 'isis circuit-level level-1', kind: vscode.CompletionItemKind.Keyword, detail: '接口Level-1' },
                    { label: 'isis circuit-level level-2', kind: vscode.CompletionItemKind.Keyword, detail: '接口Level-2' },
                    { label: 'isis cost', kind: vscode.CompletionItemKind.Keyword, detail: '配置IS-IS开销' },
                    { label: 'isis cost 10', kind: vscode.CompletionItemKind.Keyword, detail: '配置开销为10' },
                    { label: 'isis cost-style', kind: vscode.CompletionItemKind.Keyword, detail: '配置开销类型' },
                    { label: 'isis cost-style wide', kind: vscode.CompletionItemKind.Keyword, detail: '配置宽开销' },
                    { label: 'isis cost-style narrow', kind: vscode.CompletionItemKind.Keyword, detail: '配置窄开销' },
                    { label: 'isis cost-style compatible', kind: vscode.CompletionItemKind.Keyword, detail: '配置兼容模式' },
                    { label: 'isis authentication-mode', kind: vscode.CompletionItemKind.Keyword, detail: '配置IS-IS认证' },
                    { label: 'isis authentication-mode md5', kind: vscode.CompletionItemKind.Keyword, detail: '配置MD5认证' },
                    { label: 'isis authentication-mode simple', kind: vscode.CompletionItemKind.Keyword, detail: '配置明文认证' },
                    { label: 'isis authentication-keychain', kind: vscode.CompletionItemKind.Keyword, detail: '配置Keychain认证' },
                    { label: 'isis priority', kind: vscode.CompletionItemKind.Keyword, detail: '配置优先级' },
                    { label: 'isis priority 64', kind: vscode.CompletionItemKind.Keyword, detail: '配置优先级为64' },
                    { label: 'isis timer hello', kind: vscode.CompletionItemKind.Keyword, detail: '配置Hello定时器' },
                    { label: 'isis timer hello 10', kind: vscode.CompletionItemKind.Keyword, detail: '配置Hello定时器为10秒' },
                    { label: 'isis timer csnp', kind: vscode.CompletionItemKind.Keyword, detail: '配置CSNP定时器' },
                    { label: 'isis timer psnp', kind: vscode.CompletionItemKind.Keyword, detail: '配置PSNP定时器' },
                    { label: 'isis timer lsp', kind: vscode.CompletionItemKind.Keyword, detail: '配置LSP定时器' },
                    { label: 'isis timer spf', kind: vscode.CompletionItemKind.Keyword, detail: '配置SPF定时器' },
                    { label: 'isis circuit-type', kind: vscode.CompletionItemKind.Keyword, detail: '配置电路类型' },
                    { label: 'isis circuit-type p2p', kind: vscode.CompletionItemKind.Keyword, detail: '配置点对点电路' },
                    { label: 'isis circuit-type broadcast', kind: vscode.CompletionItemKind.Keyword, detail: '配置广播电路' },
                    { label: 'import-route', kind: vscode.CompletionItemKind.Keyword, detail: '引入外部路由' },
                    { label: 'import-route ospf', kind: vscode.CompletionItemKind.Keyword, detail: '引入OSPF路由' },
                    { label: 'import-route static', kind: vscode.CompletionItemKind.Keyword, detail: '引入静态路由' },
                    { label: 'import-route rip', kind: vscode.CompletionItemKind.Keyword, detail: '引入RIP路由' },
                    { label: 'import-route bgp', kind: vscode.CompletionItemKind.Keyword, detail: '引入BGP路由' },
                    { label: 'default-route-advertise', kind: vscode.CompletionItemKind.Keyword, detail: '发布默认路由' },
                    { label: 'summary-address', kind: vscode.CompletionItemKind.Keyword, detail: '路由汇总' },
                    
                    // ===== BGP路由协议扩展 =====
                    { label: 'bgp', kind: vscode.CompletionItemKind.Keyword, detail: '启动BGP协议' },
                    { label: 'bgp 100 router-id', kind: vscode.CompletionItemKind.Keyword, detail: '配置BGP Router ID' },
                    { label: 'bgp 100 router-id 1.1.1.1', kind: vscode.CompletionItemKind.Keyword, detail: '配置BGP Router ID示例' },
                    { label: 'peer', kind: vscode.CompletionItemKind.Keyword, detail: '配置BGP对等体' },
                    { label: 'peer 192.168.1.2 as-number', kind: vscode.CompletionItemKind.Keyword, detail: '配置对等体AS' },
                    { label: 'peer 192.168.1.2 as-number 200', kind: vscode.CompletionItemKind.Keyword, detail: '配置对等体AS示例' },
                    { label: 'peer 192.168.1.2 description', kind: vscode.CompletionItemKind.Keyword, detail: '配置对等体描述' },
                    { label: 'peer 192.168.1.2 password', kind: vscode.CompletionItemKind.Keyword, detail: '配置对等体密码' },
                    { label: 'peer 192.168.1.2 connect-interface', kind: vscode.CompletionItemKind.Keyword, detail: '配置连接接口' },
                    { label: 'peer 192.168.1.2 ebgp-max-hop', kind: vscode.CompletionItemKind.Keyword, detail: '配置EBGP最大跳数' },
                    { label: 'peer 192.168.1.2 ebgp-max-hop 2', kind: vscode.CompletionItemKind.Keyword, detail: '配置EBGP最大跳数为2' },
                    { label: 'peer 192.168.1.2 timer keepalive', kind: vscode.CompletionItemKind.Keyword, detail: '配置Keepalive定时器' },
                    { label: 'peer 192.168.1.2 timer hold', kind: vscode.CompletionItemKind.Keyword, detail: '配置Hold定时器' },
                    { label: 'peer 192.168.1.2 route-policy', kind: vscode.CompletionItemKind.Keyword, detail: '应用路由策略' },
                    { label: 'peer 192.168.1.2 filter-policy', kind: vscode.CompletionItemKind.Keyword, detail: '应用过滤策略' },
                    { label: 'peer 192.168.1.2 ip-prefix', kind: vscode.CompletionItemKind.Keyword, detail: '应用IP前缀列表' },
                    { label: 'peer 192.168.1.2 as-path-filter', kind: vscode.CompletionItemKind.Keyword, detail: '应用AS路径过滤器' },
                    { label: 'peer 192.168.1.2 community-filter', kind: vscode.CompletionItemKind.Keyword, detail: '应用团体过滤器' },
                    { label: 'peer 192.168.1.2 reflect-client', kind: vscode.CompletionItemKind.Keyword, detail: '配置路由反射器客户端' },
                    { label: 'peer 192.168.1.2 next-hop-local', kind: vscode.CompletionItemKind.Keyword, detail: '配置下一跳为本地' },
                    { label: 'peer 192.168.1.2 next-hop-invariable', kind: vscode.CompletionItemKind.Keyword, detail: '配置下一跳不变' },
                    { label: 'peer 192.168.1.2 allow-as-loop', kind: vscode.CompletionItemKind.Keyword, detail: '允许AS环路' },
                    { label: 'peer 192.168.1.2 advertise-community', kind: vscode.CompletionItemKind.Keyword, detail: '发布团体属性' },
                    { label: 'peer 192.168.1.2 advertise-ext-community', kind: vscode.CompletionItemKind.Keyword, detail: '发布扩展团体属性' },
                    { label: 'ipv4-family unicast', kind: vscode.CompletionItemKind.Keyword, detail: '进入IPv4单播地址族' },
                    { label: 'ipv4-family multicast', kind: vscode.CompletionItemKind.Keyword, detail: '进入IPv4组播地址族' },
                    { label: 'ipv4-family vpnv4', kind: vscode.CompletionItemKind.Keyword, detail: '进入VPNv4地址族' },
                    { label: 'ipv4-family vpn-instance', kind: vscode.CompletionItemKind.Keyword, detail: '进入VPN实例地址族' },
                    { label: 'ipv6-family unicast', kind: vscode.CompletionItemKind.Keyword, detail: '进入IPv6单播地址族' },
                    { label: 'ipv6-family vpnv6', kind: vscode.CompletionItemKind.Keyword, detail: '进入VPNv6地址族' },
                    { label: 'network', kind: vscode.CompletionItemKind.Keyword, detail: '宣告网络' },
                    { label: 'network 10.0.0.0 mask 255.0.0.0', kind: vscode.CompletionItemKind.Keyword, detail: '宣告网络示例' },
                    { label: 'import-route', kind: vscode.CompletionItemKind.Keyword, detail: '引入路由' },
                    { label: 'import-route direct', kind: vscode.CompletionItemKind.Keyword, detail: '引入直连路由' },
                    { label: 'import-route static', kind: vscode.CompletionItemKind.Keyword, detail: '引入静态路由' },
                    { label: 'import-route ospf', kind: vscode.CompletionItemKind.Keyword, detail: '引入OSPF路由' },
                    { label: 'import-route isis', kind: vscode.CompletionItemKind.Keyword, detail: '引入ISIS路由' },
                    { label: 'import-route rip', kind: vscode.CompletionItemKind.Keyword, detail: '引入RIP路由' },
                    { label: 'aggregate', kind: vscode.CompletionItemKind.Keyword, detail: '路由聚合' },
                    { label: 'aggregate 10.0.0.0 255.0.0.0', kind: vscode.CompletionItemKind.Keyword, detail: '路由聚合示例' },
                    { label: 'aggregate 10.0.0.0 255.0.0.0 detail-suppressed', kind: vscode.CompletionItemKind.Keyword, detail: '抑制详细路由' },
                    { label: 'summary automatic', kind: vscode.CompletionItemKind.Keyword, detail: '自动汇总' },
                    { label: 'bestroute as-path-ignore', kind: vscode.CompletionItemKind.Keyword, detail: '忽略AS路径' },
                    { label: 'bestroute med-none-as-maximum', kind: vscode.CompletionItemKind.Keyword, detail: 'MED缺失视为最大值' },
                    { label: 'compare-different-as-med', kind: vscode.CompletionItemKind.Keyword, detail: '比较不同AS的MED' },
                    { label: 'default local-preference', kind: vscode.CompletionItemKind.Keyword, detail: '配置默认本地优先级' },
                    { label: 'default local-preference 200', kind: vscode.CompletionItemKind.Keyword, detail: '配置默认本地优先级为200' },
                    { label: 'default med', kind: vscode.CompletionItemKind.Keyword, detail: '配置默认MED' },
                    { label: 'default med 100', kind: vscode.CompletionItemKind.Keyword, detail: '配置默认MED为100' },
                    { label: 'reflector cluster-id', kind: vscode.CompletionItemKind.Keyword, detail: '配置反射器集群ID' },
                    { label: 'rr-filter', kind: vscode.CompletionItemKind.Keyword, detail: '路由反射器过滤' },
                    
                    // ===== 静态路由扩展 =====
                    { label: 'ip route-static', kind: vscode.CompletionItemKind.Keyword, detail: '配置静态路由' },
                    { label: 'ip route-static 0.0.0.0 0.0.0.0', kind: vscode.CompletionItemKind.Keyword, detail: '配置默认路由' },
                    { label: 'ip route-static default', kind: vscode.CompletionItemKind.Keyword, detail: '配置默认路由（简化命令）' },
                    { label: 'ip route-static vpn-instance', kind: vscode.CompletionItemKind.Keyword, detail: '配置VPN实例静态路由' },
                    { label: 'ip route-static NULL0', kind: vscode.CompletionItemKind.Keyword, detail: '配置黑洞路由' },
                    { label: 'ip route-static preference', kind: vscode.CompletionItemKind.Keyword, detail: '配置静态路由优先级' },
                    { label: 'ip route-static preference 60', kind: vscode.CompletionItemKind.Keyword, detail: '配置静态路由优先级为60' },
                    { label: 'ip route-static tag', kind: vscode.CompletionItemKind.Keyword, detail: '配置静态路由标签' },
                    { label: 'ip route-static tag 100', kind: vscode.CompletionItemKind.Keyword, detail: '配置静态路由标签为100' },
                    { label: 'ip route-static description', kind: vscode.CompletionItemKind.Keyword, detail: '配置静态路由描述' },
                    { label: 'ip route-static description TO-CORE', kind: vscode.CompletionItemKind.Keyword, detail: '配置静态路由描述示例' },
                    { label: 'ip route-static permanent', kind: vscode.CompletionItemKind.Keyword, detail: '配置永久静态路由' },
                    { label: 'ip route-static track', kind: vscode.CompletionItemKind.Keyword, detail: '配置静态路由联动跟踪' },
                    { label: 'ip route-static bfd', kind: vscode.CompletionItemKind.Keyword, detail: '配置静态路由BFD联动' },
                    { label: 'ip route-static ecmp', kind: vscode.CompletionItemKind.Keyword, detail: '配置等价静态路由' },
                    { label: 'ip route-static interface', kind: vscode.CompletionItemKind.Keyword, detail: '指定出接口的静态路由' },
                    { label: 'ip route-static recursive', kind: vscode.CompletionItemKind.Keyword, detail: '配置递归静态路由' },
                    { label: 'ip route-static 10.0.0.0 255.0.0.0 192.168.1.1 preference 60', kind: vscode.CompletionItemKind.Keyword, detail: '带优先级的静态路由' },
                    { label: 'ip route-static 10.0.0.0 255.0.0.0 GigabitEthernet0/0/1', kind: vscode.CompletionItemKind.Keyword, detail: '带出接口的静态路由' },
                    { label: 'ip route-static 10.0.0.0 255.0.0.0 GigabitEthernet0/0/1 192.168.1.1', kind: vscode.CompletionItemKind.Keyword, detail: '带出接口和下一跳的静态路由' },
                    
                    // ===== 浮动静态路由 =====
                    { label: 'ip route-static float', kind: vscode.CompletionItemKind.Keyword, detail: '配置浮动静态路由' },
                    { label: 'ip route-static 0.0.0.0 0.0.0.0 192.168.1.1 preference 60', kind: vscode.CompletionItemKind.Keyword, detail: '主用默认路由（优先级60）' },
                    { label: 'ip route-static 0.0.0.0 0.0.0.0 192.168.2.1 preference 80', kind: vscode.CompletionItemKind.Keyword, detail: '备用默认路由（优先级80）' },
                    
                    // ===== 等价静态路由 =====
                    { label: 'ip route-static 10.0.0.0 255.0.0.0 192.168.1.1', kind: vscode.CompletionItemKind.Keyword, detail: '等价路由路径1' },
                    { label: 'ip route-static 10.0.0.0 255.0.0.0 192.168.2.1', kind: vscode.CompletionItemKind.Keyword, detail: '等价路由路径2' },
                    { label: 'ip route-static 10.0.0.0 255.0.0.0 192.168.3.1', kind: vscode.CompletionItemKind.Keyword, detail: '等价路由路径3' },
                    
                    // ===== VPN静态路由 =====
                    { label: 'ip route-static vpn-instance vpn1 10.1.1.0 255.255.255.0 192.168.1.1', kind: vscode.CompletionItemKind.Keyword, detail: 'VPN实例静态路由' },
                    { label: 'ip route-static vpn-instance vpn1 0.0.0.0 0.0.0.0 192.168.1.1', kind: vscode.CompletionItemKind.Keyword, detail: 'VPN实例默认路由' },
                    { label: 'ip route-static vpn-instance vpn1 10.1.1.0 255.255.255.0 GigabitEthernet0/0/1', kind: vscode.CompletionItemKind.Keyword, detail: 'VPN实例带出接口静态路由' },
                    
                    // ===== IPv6静态路由 =====
                    { label: 'ipv6 route-static', kind: vscode.CompletionItemKind.Keyword, detail: '配置IPv6静态路由' },
                    { label: 'ipv6 route-static :: 0', kind: vscode.CompletionItemKind.Keyword, detail: '配置IPv6默认路由' },
                    { label: 'ipv6 route-static 2001:db8:1:: 64 2001:db8:2::1', kind: vscode.CompletionItemKind.Keyword, detail: 'IPv6静态路由' },
                    { label: 'ipv6 route-static preference', kind: vscode.CompletionItemKind.Keyword, detail: 'IPv6静态路由优先级' },
                    { label: 'ipv6 route-static vpn-instance', kind: vscode.CompletionItemKind.Keyword, detail: 'VPN实例IPv6静态路由' },
                    
                    // ===== 策略路由 =====
                    { label: 'policy-based-route', kind: vscode.CompletionItemKind.Keyword, detail: '配置策略路由' },
                    { label: 'policy-based-route pbr1 permit node 10', kind: vscode.CompletionItemKind.Keyword, detail: '策略路由节点配置' },
                    { label: 'if-match acl', kind: vscode.CompletionItemKind.Keyword, detail: '策略路由匹配条件' },
                    { label: 'if-match ip-prefix', kind: vscode.CompletionItemKind.Keyword, detail: '匹配IP前缀' },
                    { label: 'if-match interface', kind: vscode.CompletionItemKind.Keyword, detail: '匹配入接口' },
                    { label: 'apply ip-address next-hop', kind: vscode.CompletionItemKind.Keyword, detail: '策略路由应用下一跳' },
                    { label: 'apply output-interface', kind: vscode.CompletionItemKind.Keyword, detail: '策略路由应用出接口' },
                    { label: 'apply default-next-hop', kind: vscode.CompletionItemKind.Keyword, detail: '策略路由应用默认下一跳' },
                    { label: 'ip policy-based-route', kind: vscode.CompletionItemKind.Keyword, detail: '应用策略路由到接口' },
                    
                    // ===== MPLS基础命令 =====
                    { label: 'mpls', kind: vscode.CompletionItemKind.Keyword, detail: '启用MPLS' },
                    { label: 'mpls lsr-id', kind: vscode.CompletionItemKind.Keyword, detail: '配置MPLS LSR ID' },
                    { label: 'mpls lsr-id 1.1.1.1', kind: vscode.CompletionItemKind.Keyword, detail: '配置MPLS LSR ID示例' },
                    { label: 'mpls label', kind: vscode.CompletionItemKind.Keyword, detail: '配置MPLS标签' },
                    { label: 'mpls label range', kind: vscode.CompletionItemKind.Keyword, detail: '配置标签范围' },
                    { label: 'mpls label range 100 199', kind: vscode.CompletionItemKind.Keyword, detail: '配置标签范围100-199' },
                    { label: 'mpls mtu', kind: vscode.CompletionItemKind.Keyword, detail: '配置MPLS MTU' },
                    { label: 'mpls mtu 1500', kind: vscode.CompletionItemKind.Keyword, detail: '配置MPLS MTU为1500' },
                    { label: 'mpls ttl', kind: vscode.CompletionItemKind.Keyword, detail: '配置MPLS TTL' },
                    { label: 'mpls ttl propagate', kind: vscode.CompletionItemKind.Keyword, detail: '配置TTL传播' },
                    { label: 'mpls ttl propagate disable', kind: vscode.CompletionItemKind.Keyword, detail: '禁用TTL传播' },
                    { label: 'mpls forwarding', kind: vscode.CompletionItemKind.Keyword, detail: '显示MPLS转发信息' },
                    
                    // ===== LDP命令 =====
                    { label: 'mpls ldp', kind: vscode.CompletionItemKind.Keyword, detail: '启用MPLS LDP' },
                    { label: 'mpls ldp enable', kind: vscode.CompletionItemKind.Keyword, detail: '在接口启用LDP' },
                    { label: 'mpls ldp lsp-trigger', kind: vscode.CompletionItemKind.Keyword, detail: '配置LSP触发策略' },
                    { label: 'mpls ldp transport-address', kind: vscode.CompletionItemKind.Keyword, detail: '配置传输地址' },
                    { label: 'mpls ldp transport-address interface', kind: vscode.CompletionItemKind.Keyword, detail: '使用接口地址作为传输地址' },
                    { label: 'mpls ldp neighbor', kind: vscode.CompletionItemKind.Keyword, detail: '配置LDP邻居' },
                    { label: 'mpls ldp neighbor 2.2.2.2', kind: vscode.CompletionItemKind.Keyword, detail: '配置LDP邻居示例' },
                    { label: 'mpls ldp authentication', kind: vscode.CompletionItemKind.Keyword, detail: '配置LDP认证' },
                    { label: 'mpls ldp authentication md5', kind: vscode.CompletionItemKind.Keyword, detail: '配置LDP MD5认证' },
                    { label: 'mpls ldp timer hello-hold', kind: vscode.CompletionItemKind.Keyword, detail: '配置Hello保持时间' },
                    { label: 'mpls ldp timer keepalive-hold', kind: vscode.CompletionItemKind.Keyword, detail: '配置Keepalive保持时间' },
                    { label: 'mpls ldp advertisement', kind: vscode.CompletionItemKind.Keyword, detail: '配置标签通告方式' },
                    { label: 'mpls ldp advertisement dual-stack', kind: vscode.CompletionItemKind.Keyword, detail: '配置双栈通告' },
                    { label: 'display mpls ldp session', kind: vscode.CompletionItemKind.Keyword, detail: '显示LDP会话' },
                    { label: 'display mpls ldp lsp', kind: vscode.CompletionItemKind.Keyword, detail: '显示LDP LSP' },
                    { label: 'display mpls ldp neighbor', kind: vscode.CompletionItemKind.Keyword, detail: '显示LDP邻居' },
                    
                    // ===== MPLS VPN命令 =====
                    { label: 'ip vpn-instance', kind: vscode.CompletionItemKind.Keyword, detail: '创建VPN实例' },
                    { label: 'ip vpn-instance vpn1', kind: vscode.CompletionItemKind.Keyword, detail: '创建VPN实例vpn1' },
                    { label: 'route-distinguisher', kind: vscode.CompletionItemKind.Keyword, detail: '配置RD' },
                    { label: 'route-distinguisher 100:1', kind: vscode.CompletionItemKind.Keyword, detail: '配置RD 100:1' },
                    { label: 'vpn-target', kind: vscode.CompletionItemKind.Keyword, detail: '配置RT' },
                    { label: 'vpn-target 100:1 both', kind: vscode.CompletionItemKind.Keyword, detail: '配置RT 100:1 import/export' },
                    { label: 'vpn-target 100:1 import', kind: vscode.CompletionItemKind.Keyword, detail: '配置RT 100:1 import' },
                    { label: 'vpn-target 100:1 export', kind: vscode.CompletionItemKind.Keyword, detail: '配置RT 100:1 export' },
                    { label: 'vpn-target 100:1 both', kind: vscode.CompletionItemKind.Keyword, detail: '配置RT 100:1 both' },
                    { label: 'import route-policy', kind: vscode.CompletionItemKind.Keyword, detail: '配置导入路由策略' },
                    { label: 'export route-policy', kind: vscode.CompletionItemKind.Keyword, detail: '配置导出路由策略' },
                    { label: 'tnl-policy', kind: vscode.CompletionItemKind.Keyword, detail: '配置隧道策略' },
                    
                    // ===== BGP VPNv4命令 =====
                    { label: 'ipv4-family vpnv4', kind: vscode.CompletionItemKind.Keyword, detail: '进入VPNv4地址族' },
                    { label: 'peer 1.1.1.1 enable', kind: vscode.CompletionItemKind.Keyword, detail: '启用VPNv4对等体' },
                    { label: 'peer 1.1.1.1 advertise-community', kind: vscode.CompletionItemKind.Keyword, detail: '发布团体属性' },
                    { label: 'peer 1.1.1.1 advertise-ext-community', kind: vscode.CompletionItemKind.Keyword, detail: '发布扩展团体属性' },
                    { label: 'peer 1.1.1.1 reflect-client', kind: vscode.CompletionItemKind.Keyword, detail: '配置路由反射器客户端' },
                    { label: 'policy vpn-target', kind: vscode.CompletionItemKind.Keyword, detail: '启用VPN Target策略' },
                    
                    // ===== VPLS命令 =====
                    { label: 'vsi', kind: vscode.CompletionItemKind.Keyword, detail: '创建VSI' },
                    { label: 'vsi vsi1', kind: vscode.CompletionItemKind.Keyword, detail: '创建VSI vsi1' },
                    { label: 'pwsignal ldp', kind: vscode.CompletionItemKind.Keyword, detail: '配置PW信令为LDP' },
                    { label: 'vsi-id', kind: vscode.CompletionItemKind.Keyword, detail: '配置VSI ID' },
                    { label: 'vsi-id 100', kind: vscode.CompletionItemKind.Keyword, detail: '配置VSI ID为100' },
                    { label: 'peer 2.2.2.2', kind: vscode.CompletionItemKind.Keyword, detail: '配置对等体' },
                    { label: 'encapsulation', kind: vscode.CompletionItemKind.Keyword, detail: '配置封装类型' },
                    { label: 'encapsulation vlan', kind: vscode.CompletionItemKind.Keyword, detail: '配置VLAN封装' },
                    { label: 'encapsulation ethernet', kind: vscode.CompletionItemKind.Keyword, detail: '配置以太网封装' },
                    
                    // ===== MPLS TE命令 =====
                    { label: 'mpls te', kind: vscode.CompletionItemKind.Keyword, detail: '启用MPLS TE' },
                    { label: 'mpls te cspf', kind: vscode.CompletionItemKind.Keyword, detail: '启用CSPF' },
                    { label: 'mpls te igp-shortcut', kind: vscode.CompletionItemKind.Keyword, detail: '启用IGP快捷方式' },
                    { label: 'mpls te auto-frr', kind: vscode.CompletionItemKind.Keyword, detail: '启用自动FRR' },
                    { label: 'mpls te bandwidth', kind: vscode.CompletionItemKind.Keyword, detail: '配置TE带宽' },
                    { label: 'mpls te bandwidth 1000', kind: vscode.CompletionItemKind.Keyword, detail: '配置TE带宽1000kbps' },
                    { label: 'mpls te priority', kind: vscode.CompletionItemKind.Keyword, detail: '配置TE优先级' },
                    { label: 'mpls te priority 0', kind: vscode.CompletionItemKind.Keyword, detail: '配置TE优先级为0' },
                    { label: 'mpls te affinity', kind: vscode.CompletionItemKind.Keyword, detail: '配置TE亲和属性' },
                    
                    // ===== OSPF VPN扩展 =====
                    { label: 'ospf 1 vpn-instance', kind: vscode.CompletionItemKind.Keyword, detail: '配置OSPF VPN实例' },
                    { label: 'ospf 1 vpn-instance vpn1', kind: vscode.CompletionItemKind.Keyword, detail: '配置OSPF VPN实例vpn1' },
                    { label: 'vpn-instance-capability', kind: vscode.CompletionItemKind.Keyword, detail: '配置VPN实例能力' },
                    { label: 'vpn-instance-capability simple', kind: vscode.CompletionItemKind.Keyword, detail: '配置简单VPN实例能力' },
                    { label: 'route-tag', kind: vscode.CompletionItemKind.Keyword, detail: '配置路由标签' },
                    { label: 'route-tag 100', kind: vscode.CompletionItemKind.Keyword, detail: '配置路由标签为100' },
                    { label: 'domain-id', kind: vscode.CompletionItemKind.Keyword, detail: '配置域ID' },
                    { label: 'domain-id 100:1', kind: vscode.CompletionItemKind.Keyword, detail: '配置域ID 100:1' },
                    
                    // ===== BGP VPN实例命令 =====
                    { label: 'ipv4-family vpn-instance', kind: vscode.CompletionItemKind.Keyword, detail: '进入VPN实例地址族' },
                    { label: 'ipv4-family vpn-instance vpn1', kind: vscode.CompletionItemKind.Keyword, detail: '进入VPN实例vpn1' },
                    { label: 'peer 10.1.1.2 as-number', kind: vscode.CompletionItemKind.Keyword, detail: '配置VPN实例对等体' },
                    { label: 'peer 10.1.1.2 as-number 200', kind: vscode.CompletionItemKind.Keyword, detail: '配置VPN实例对等体AS' },
                    { label: 'import-route direct', kind: vscode.CompletionItemKind.Keyword, detail: '引入直连路由' },
                    { label: 'import-route static', kind: vscode.CompletionItemKind.Keyword, detail: '引入静态路由' },
                    { label: 'import-route ospf', kind: vscode.CompletionItemKind.Keyword, detail: '引入OSPF路由' },
                    { label: 'default-route imported', kind: vscode.CompletionItemKind.Keyword, detail: '引入默认路由' },
                    
                    // ===== ISIS VPN扩展 =====
                    { label: 'isis 1 vpn-instance', kind: vscode.CompletionItemKind.Keyword, detail: '配置ISIS VPN实例' },
                    { label: 'isis 1 vpn-instance vpn1', kind: vscode.CompletionItemKind.Keyword, detail: '配置ISIS VPN实例vpn1' },
                    
                    // ===== RIP VPN扩展 =====
                    { label: 'rip 1 vpn-instance', kind: vscode.CompletionItemKind.Keyword, detail: '配置RIP VPN实例' },
                    { label: 'rip 1 vpn-instance vpn1', kind: vscode.CompletionItemKind.Keyword, detail: '配置RIP VPN实例vpn1' },
                    
                    // ===== 路由策略 =====
                    { label: 'route-policy', kind: vscode.CompletionItemKind.Keyword, detail: '创建路由策略' },
                    { label: 'route-policy RP1 permit node 10', kind: vscode.CompletionItemKind.Keyword, detail: '创建路由策略节点' },
                    { label: 'if-match acl', kind: vscode.CompletionItemKind.Keyword, detail: '匹配ACL' },
                    { label: 'if-match ip-prefix', kind: vscode.CompletionItemKind.Keyword, detail: '匹配IP前缀' },
                    { label: 'if-match cost', kind: vscode.CompletionItemKind.Keyword, detail: '匹配开销' },
                    { label: 'if-match tag', kind: vscode.CompletionItemKind.Keyword, detail: '匹配标签' },
                    { label: 'if-match route-type', kind: vscode.CompletionItemKind.Keyword, detail: '匹配路由类型' },
                    { label: 'apply cost', kind: vscode.CompletionItemKind.Keyword, detail: '应用开销' },
                    { label: 'apply cost 100', kind: vscode.CompletionItemKind.Keyword, detail: '应用开销100' },
                    { label: 'apply tag', kind: vscode.CompletionItemKind.Keyword, detail: '应用标签' },
                    { label: 'apply tag 100', kind: vscode.CompletionItemKind.Keyword, detail: '应用标签100' },
                    { label: 'apply preference', kind: vscode.CompletionItemKind.Keyword, detail: '应用优先级' },
                    { label: 'apply preference 60', kind: vscode.CompletionItemKind.Keyword, detail: '应用优先级60' },
                    { label: 'apply community', kind: vscode.CompletionItemKind.Keyword, detail: '应用团体属性' },
                    { label: 'apply extcommunity', kind: vscode.CompletionItemKind.Keyword, detail: '应用扩展团体属性' },
                    
                    // ===== 前缀列表 =====
                    { label: 'ip ip-prefix', kind: vscode.CompletionItemKind.Keyword, detail: '创建IP前缀列表' },
                    { label: 'ip ip-prefix P1 permit 10.0.0.0 8', kind: vscode.CompletionItemKind.Keyword, detail: '允许10.0.0.0/8' },
                    { label: 'ip ip-prefix P1 permit 10.0.0.0 8 greater-equal 16 less-equal 24', kind: vscode.CompletionItemKind.Keyword, detail: '配置前缀列表范围' },
                    
                    // ===== 显示命令 =====
                    { label: 'display', kind: vscode.CompletionItemKind.Keyword, detail: '显示信息' },
                    { label: 'display this', kind: vscode.CompletionItemKind.Keyword, detail: '显示当前视图配置' },
                    { label: 'display interface', kind: vscode.CompletionItemKind.Keyword, detail: '显示接口信息' },
                    { label: 'display interface brief', kind: vscode.CompletionItemKind.Keyword, detail: '显示接口简要信息' },
                    { label: 'display ip interface', kind: vscode.CompletionItemKind.Keyword, detail: '显示IP接口信息' },
                    { label: 'display ip interface brief', kind: vscode.CompletionItemKind.Keyword, detail: '显示IP接口简要信息' },
                    { label: 'display ip routing-table', kind: vscode.CompletionItemKind.Keyword, detail: '显示路由表' },
                    { label: 'display ip routing-table protocol', kind: vscode.CompletionItemKind.Keyword, detail: '显示协议路由表' },
                    { label: 'display ip routing-table static', kind: vscode.CompletionItemKind.Keyword, detail: '显示静态路由' },
                    { label: 'display ip routing-table vpn-instance', kind: vscode.CompletionItemKind.Keyword, detail: '显示VPN实例路由表' },
                    
                    // ===== MPLS显示命令 =====
                    { label: 'display mpls lsp', kind: vscode.CompletionItemKind.Keyword, detail: '显示MPLS LSP' },
                    { label: 'display mpls ldp session', kind: vscode.CompletionItemKind.Keyword, detail: '显示LDP会话' },
                    { label: 'display mpls ldp lsp', kind: vscode.CompletionItemKind.Keyword, detail: '显示LDP LSP' },
                    { label: 'display mpls ldp neighbor', kind: vscode.CompletionItemKind.Keyword, detail: '显示LDP邻居' },
                    { label: 'display mpls forwarding', kind: vscode.CompletionItemKind.Keyword, detail: '显示MPLS转发信息' },
                    
                    // ===== VPN显示命令 =====
                    { label: 'display ip vpn-instance', kind: vscode.CompletionItemKind.Keyword, detail: '显示VPN实例' },
                    { label: 'display ip vpn-instance vpn1', kind: vscode.CompletionItemKind.Keyword, detail: '显示VPN实例vpn1' },
                    { label: 'display bgp vpnv4 all', kind: vscode.CompletionItemKind.Keyword, detail: '显示所有VPNv4路由' },
                    { label: 'display bgp vpnv4 all routing-table', kind: vscode.CompletionItemKind.Keyword, detail: '显示VPNv4路由表' },
                    { label: 'display ospf vpn-instance', kind: vscode.CompletionItemKind.Keyword, detail: '显示VPN实例OSPF信息' },
                    { label: 'display vsi', kind: vscode.CompletionItemKind.Keyword, detail: '显示VSI信息' }
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
                
                // OSPF
                'ospf': '启动OSPF协议\n\n**示例**：\n```\nospf 1 router-id 1.1.1.1\narea 0\nnetwork 192.168.1.0 0.0.0.255\n```',
                'import-route': '引入外部路由\n\n**示例**：\n```\nimport-route static\nimport-route direct\n```',
                'default-route-advertise': '发布默认路由\n\n**示例**：\n```\ndefault-route-advertise always\n```',
                
                // BGP
                'bgp': '启动BGP协议\n\n**示例**：\n```\nbgp 100\npeer 192.168.1.2 as-number 200\n```',
                'peer': '配置BGP对等体\n\n**示例**：\n```\npeer 192.168.1.2 as-number 200\npeer 192.168.1.2 description PEER-ROUTER\n```',
                
                // ISIS
                'isis': '启动IS-IS协议\n\n**示例**：\n```\nisis 1\nnetwork-entity 49.0001.0010.0100.1001.00\n```',
                'network-entity': '配置网络实体\n\n**示例**：\n```\nnetwork-entity 49.0001.0010.0100.1001.00\n```',
                
                // 静态路由
                'ip route-static': '配置静态路由\n\n**格式**：\n`ip route-static destination-address { mask | mask-length } { interface-type interface-number | nexthop-address } [ preference preference-value ]`\n\n**示例**：\n```\nip route-static 10.0.0.0 255.0.0.0 192.168.1.1\nip route-static 0.0.0.0 0.0.0.0 192.168.1.254 preference 60\n```',
                
                // MPLS
                'mpls': '启用MPLS\n\n**示例**：\n```\nmpls lsr-id 1.1.1.1\nmpls label range 100 199\n```',
                'mpls ldp': '启用MPLS LDP\n\n**示例**：\n```\ninterface GigabitEthernet0/0/1\nmpls ldp enable\n```',
                
                // VPN
                'ip vpn-instance': '创建VPN实例\n\n**示例**：\n```\nip vpn-instance vpn1\nroute-distinguisher 100:1\nvpn-target 100:1 both\n```',
                'route-distinguisher': '配置路由区分符(RD)\n\n**示例**：\n```\nroute-distinguisher 100:1\n```',
                'vpn-target': '配置VPN目标(RT)\n\n**示例**：\n```\nvpn-target 100:1 import\nvpn-target 100:1 export\n```'
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
    vscode.window.setStatusBarMessage('$(check) 华为/华三命令集 v1.2.0 已加载（支持MPLS VPN和高级路由协议）', 3000);
}

/**
 * 扩展停用函数
 */
function deactivate() {}

module.exports = {
    activate,
    deactivate
};