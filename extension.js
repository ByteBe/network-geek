const vscode = require('vscode');
const ExtensionUpdater = require('./updater');

let updater = null;

/**
 * 扩展激活函数
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    console.log('✅ 华为/华三命令集扩展已激活！');
    
    // 显示激活消息
    vscode.window.showInformationMessage('华为/华三命令集扩展已加载，作者: network-geek');
    
    // 初始化更新器
    updater = new ExtensionUpdater(context);
    updater.start();
    
    // 注册命令提示
    const commandProvider = vscode.languages.registerCompletionItemProvider(
        'huawei-h3c',
        {
            provideCompletionItems(document, position) {
                const linePrefix = document.lineAt(position).text.substr(0, position.character);
                
                // 基础命令提示
                const commands = [
                    // 系统视图命令
                    { label: 'system-view', kind: vscode.CompletionItemKind.Keyword, detail: '进入系统视图' },
                    { label: 'sysname', kind: vscode.CompletionItemKind.Keyword, detail: '设置设备名称' },
                    { label: 'quit', kind: vscode.CompletionItemKind.Keyword, detail: '退出当前视图' },
                    { label: 'return', kind: vscode.CompletionItemKind.Keyword, detail: '直接返回用户视图' },
                    { label: 'save', kind: vscode.CompletionItemKind.Keyword, detail: '保存配置' },
                    
                    // 接口配置命令
                    { label: 'interface', kind: vscode.CompletionItemKind.Keyword, detail: '进入接口视图' },
                    { label: 'ip address', kind: vscode.CompletionItemKind.Keyword, detail: '配置IP地址' },
                    { label: 'shutdown', kind: vscode.CompletionItemKind.Keyword, detail: '关闭接口' },
                    { label: 'undo shutdown', kind: vscode.CompletionItemKind.Keyword, detail: '开启接口' },
                    { label: 'description', kind: vscode.CompletionItemKind.Keyword, detail: '配置接口描述' },
                    
                    // VLAN配置命令
                    { label: 'vlan', kind: vscode.CompletionItemKind.Keyword, detail: '创建VLAN' },
                    { label: 'port', kind: vscode.CompletionItemKind.Keyword, detail: '将端口加入VLAN' },
                    { label: 'port link-type', kind: vscode.CompletionItemKind.Keyword, detail: '设置端口链路类型' },
                    { label: 'port trunk allow-pass', kind: vscode.CompletionItemKind.Keyword, detail: '设置Trunk允许的VLAN' },
                    
                    // 路由协议命令
                    { label: 'ospf', kind: vscode.CompletionItemKind.Keyword, detail: '启动OSPF协议' },
                    { label: 'area', kind: vscode.CompletionItemKind.Keyword, detail: '配置OSPF区域' },
                    { label: 'network', kind: vscode.CompletionItemKind.Keyword, detail: '宣告网络' },
                    { label: 'rip', kind: vscode.CompletionItemKind.Keyword, detail: '启动RIP协议' },
                    
                    // 显示命令
                    { label: 'display', kind: vscode.CompletionItemKind.Keyword, detail: '显示信息' },
                    { label: 'display interface', kind: vscode.CompletionItemKind.Keyword, detail: '显示接口信息' },
                    { label: 'display vlan', kind: vscode.CompletionItemKind.Keyword, detail: '显示VLAN信息' },
                    { label: 'display current-configuration', kind: vscode.CompletionItemKind.Keyword, detail: '显示当前配置' },
                    
                    // 安全配置
                    { label: 'acl', kind: vscode.CompletionItemKind.Keyword, detail: '配置ACL' },
                    { label: 'rule', kind: vscode.CompletionItemKind.Keyword, detail: '配置ACL规则' },
                    
                    // STP配置
                    { label: 'stp enable', kind: vscode.CompletionItemKind.Keyword, detail: '启用STP' },
                    { label: 'stp mode', kind: vscode.CompletionItemKind.Keyword, detail: '设置STP模式' },
                    
                    // DHCP配置
                    { label: 'dhcp enable', kind: vscode.CompletionItemKind.Keyword, detail: '启用DHCP' },
                    { label: 'dhcp server', kind: vscode.CompletionItemKind.Keyword, detail: '配置DHCP服务器' }
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

    // 注册悬停提示
    const hoverProvider = vscode.languages.registerHoverProvider('huawei-h3c', {
        provideHover(document, position) {
            const wordRange = document.getWordRangeAtPosition(position);
            if (!wordRange) return null;
            
            const word = document.getText(wordRange);
            
            const hoverTexts = {
                'system-view': '进入系统视图，用于全局配置',
                'sysname': '设置设备名称，例如：sysname SW-1',
                'interface': '进入接口配置视图',
                'vlan': '创建VLAN，例如：vlan 10',
                'display': '显示设备信息，如：display current-configuration',
                'ospf': '启动OSPF路由协议',
                'rip': '启动RIP路由协议',
                'acl': '配置访问控制列表',
                'stp': '配置生成树协议',
                'dhcp': '配置DHCP服务'
            };
            
            if (hoverTexts[word]) {
                return new vscode.Hover(hoverTexts[word]);
            }
        }
    });
    
    // 注册手动检查更新命令
    const checkUpdateCommand = vscode.commands.registerCommand('huawei-h3c-commands.checkUpdate', () => {
        updater.manualCheck();
    });
    
    // 注册设置更新服务器命令
    const setUpdateUrlCommand = vscode.commands.registerCommand('huawei-h3c-commands.setUpdateUrl', async () => {
        const url = await vscode.window.showInputBox({
            prompt: '请输入自定义更新服务器URL',
            placeHolder: 'https://your-server.com/updates.json',
            value: updater.updateUrl
        });
        
        if (url) {
            updater.updateUrl = url;
            await context.globalState.update('updateUrl', url);
            vscode.window.showInformationMessage('更新服务器地址已设置');
        }
    });
    
    context.subscriptions.push(commandProvider);
    context.subscriptions.push(hoverProvider);
    context.subscriptions.push(checkUpdateCommand);
    context.subscriptions.push(setUpdateUrlCommand);
}

/**
 * 扩展停用函数
 */
function deactivate() {}

module.exports = {
    activate,
    deactivate
};