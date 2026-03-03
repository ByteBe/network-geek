const vscode = require('vscode');
const ExtensionUpdater = require('./updater');
const commandManager = require('./commands/index');

let updater = null;
let allCommands = null;

/**
 * 扩展激活函数
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    console.log('✅ 华为/华三命令集扩展 v1.3.0 已激活！');
    
    // 显示激活消息
    vscode.window.showInformationMessage('🚀 华为/华三命令集扩展已加载 (v1.3.0，优化版)，作者: network-geek');
    
    // 初始化更新器
    updater = new ExtensionUpdater(context);
    updater.start();
    
    // 延迟加载所有命令（优化启动性能）
    setTimeout(() => {
        allCommands = commandManager.getAllCommands();
        console.log(`📚 已加载 ${allCommands.length} 条唯一命令`);
    }, 100);
    
    // ========== 1. 命令提示提供器 ==========
    const commandProvider = vscode.languages.registerCompletionItemProvider(
        'huawei-h3c',
        {
            provideCompletionItems(document, position) {
                // 确保命令已加载
                if (!allCommands) {
                    allCommands = commandManager.getAllCommands();
                }
                
                const linePrefix = document.lineAt(position).text.substr(0, position.character);
                
                // 根据输入过滤命令（优化性能）
                const filteredCommands = allCommands.filter(cmd => 
                    cmd.label.startsWith(linePrefix.trim()) || linePrefix.trim() === ''
                );
                
                return filteredCommands.map(cmd => {
                    const item = new vscode.CompletionItem(cmd.label, cmd.kind);
                    item.detail = cmd.detail;
                    item.insertText = cmd.label + ' ';
                    return item;
                });
            }
        },
        ' ' // 触发字符
    );

    // ========== 2. 悬停提示提供器 ==========
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
                
                // 接口配置
                'interface': '进入接口配置视图\n\n**示例**：\n```\ninterface GigabitEthernet0/0/1\nip address 192.168.1.1 24\n```',
                'ip address': '配置接口IP地址\n\n**示例**：\n```\nip address 192.168.1.1 255.255.255.0\n```',
                
                // VLAN
                'vlan': '创建VLAN或进入VLAN视图\n\n**示例**：\n```\nvlan 10\nname Sales\n```',
                'vlan batch': '批量创建VLAN\n\n**示例**：\n```\nvlan batch 10 20 30\nvlan batch 100 to 200\n```',
                
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
                'vpn-target': '配置VPN目标(RT)\n\n**示例**：\n```\nvpn-target 100:1 import\nvpn-target 100:1 export\n```',
                
                // STP
                'stp mode': '设置STP模式\n\n**选项**：stp, rstp, mstp\n\n**示例**：\n```\nstp mode rstp\n```',
                
                // DHCP
                'dhcp enable': '启用DHCP服务\n\n**示例**：\n```\ndhcp enable\n```',
                'dhcp server': '配置DHCP服务器参数\n\n**示例**：\n```\ndhcp server dns-list 8.8.8.8\n```',
                
                // 诊断
                'ping': '网络连通性测试\n\n**示例**：\n```\nping 192.168.1.1\nping -c 5 192.168.1.1\n```',
                'tracert': '路由跟踪\n\n**示例**：\n```\ntracert 192.168.1.1\n```',
                
                // 链路聚合
                'eth-trunk': '配置Eth-Trunk接口\n\n**示例**：\n```\ninterface Eth-Trunk1\nport link-type trunk\ntrunkport GigabitEthernet0/0/1 to 0/0/4\n```',
                
                // 策略路由
                'policy-based-route': '配置策略路由\n\n**示例**：\n```\npolicy-based-route pbr1 permit node 10\n if-match acl 3000\n apply ip-address next-hop 192.168.1.1\n quit\n```'
            };
            
            if (hoverTexts[word]) {
                return new vscode.Hover(hoverTexts[word]);
            }
            
            return null;
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
    vscode.window.setStatusBarMessage('$(check) 华为/华三命令集 v1.3.0 已加载（优化版）', 3000);
}

/**
 * 扩展停用函数
 */
function deactivate() {}

module.exports = {
    activate,
    deactivate
};