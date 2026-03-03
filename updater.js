const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const https = require('https');
const { exec } = require('child_process');

class ExtensionUpdater {
    /**
     * @param {vscode.ExtensionContext} context
     */
    constructor(context) {
        this.context = context;
        this.extensionId = 'network-geek.huawei-h3c-commands';
        const extension = vscode.extensions.getExtension(this.extensionId);
        this.currentVersion = extension ? extension.packageJSON.version : '1.2.0';
        this.updateUrl = 'https://api.github.com/repos/ByteBe/network-geek/releases/latest';
        this.downloadBaseUrl = 'https://github.com/ByteBe/network-geek/releases/download';
        this.checkInterval = 24 * 60 * 60 * 1000; // 每天检查一次（毫秒）
        
        // 从全局状态中读取自定义URL
        const savedUrl = context.globalState.get('updateUrl');
        if (savedUrl) {
            this.updateUrl = savedUrl;
        }
    }

    /**
     * 启动自动更新服务
     */
    start() {
        // 立即检查一次
        this.checkForUpdates();
        
        // 设置定时检查
        const interval = setInterval(() => {
            this.checkForUpdates();
        }, this.checkInterval);
        
        // 添加到订阅，确保清理
        this.context.subscriptions.push({ dispose: () => clearInterval(interval) });
        
        console.log('自动更新服务已启动，当前版本:', this.currentVersion);
    }

    /**
     * 检查更新
     */
    async checkForUpdates() {
        try {
            vscode.window.setStatusBarMessage('$(sync) 检查扩展更新...', 2000);
            
            const latestVersion = await this.getLatestVersion();
            
            if (this.compareVersions(latestVersion, this.currentVersion) > 0) {
                this.promptUpdate(latestVersion);
            } else {
                console.log('当前已是最新版本:', this.currentVersion);
            }
        } catch (error) {
            console.error('检查更新失败:', error.message);
        }
    }

    /**
     * 从GitHub获取最新版本
     * @returns {Promise<string>}
     */
    getLatestVersion() {
        return new Promise((resolve, reject) => {
            const options = {
                headers: {
                    'User-Agent': 'VSCode-Extension-Updater'
                }
            };

            const url = this.updateUrl;
            
            https.get(url, options, (res) => {
                let data = '';
                
                res.on('data', (chunk) => {
                    data += chunk;
                });
                
                res.on('end', () => {
                    try {
                        const release = JSON.parse(data);
                        // 从tag_name中提取版本号 (例如: v1.2.0 -> 1.2.0)
                        const version = release.tag_name.replace('v', '');
                        resolve(version);
                    } catch (error) {
                        reject(new Error('解析版本信息失败'));
                    }
                });
            }).on('error', (error) => {
                reject(new Error('网络请求失败: ' + error.message));
            });
        });
    }

    /**
     * 比较版本号
     * @param {string} v1 
     * @param {string} v2 
     * @returns {number} 1: v1 > v2, 0: 相等, -1: v1 < v2
     */
    compareVersions(v1, v2) {
        const v1Parts = v1.split('.').map(Number);
        const v2Parts = v2.split('.').map(Number);
        
        for (let i = 0; i < 3; i++) {
            if (v1Parts[i] > v2Parts[i]) return 1;
            if (v1Parts[i] < v2Parts[i]) return -1;
        }
        return 0;
    }

    /**
     * 提示用户更新
     * @param {string} latestVersion 
     */
    promptUpdate(latestVersion) {
        const message = `发现新版本 ${latestVersion} (当前版本 ${this.currentVersion})，是否更新？`;
        const actions = ['立即更新', '查看更新内容', '稍后提醒'];
        
        vscode.window.showInformationMessage(message, ...actions).then(async (action) => {
            switch (action) {
                case '立即更新':
                    await this.downloadAndInstallUpdate(latestVersion);
                    break;
                case '查看更新内容':
                    vscode.env.openExternal(vscode.Uri.parse('https://github.com/ByteBe/network-geek/releases/latest'));
                    break;
                case '稍后提醒':
                    // 1小时后再次提醒
                    setTimeout(() => this.checkForUpdates(), 60 * 60 * 1000);
                    break;
            }
        });
    }

    /**
     * 下载并安装更新
     * @param {string} version 
     */
    async downloadAndInstallUpdate(version) {
        try {
            // 显示进度
            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: '正在下载更新...',
                cancellable: false
            }, async (progress) => {
                progress.report({ increment: 0, message: '准备下载' });
                
                // 构建下载URL
                const fileName = `huawei-h3c-commands-${version}.vsix`;
                const downloadUrl = `${this.downloadBaseUrl}/v${version}/${fileName}`;
                
                // 创建更新目录
                const updatesDir = path.join(this.context.extensionPath, 'updates');
                if (!fs.existsSync(updatesDir)) {
                    fs.mkdirSync(updatesDir, { recursive: true });
                }
                
                const downloadPath = path.join(updatesDir, fileName);
                
                progress.report({ increment: 10, message: '连接服务器...' });
                
                // 下载文件
                await this.downloadFile(downloadUrl, downloadPath, progress);
                
                progress.report({ increment: 80, message: '正在安装...' });
                
                // 安装更新
                await this.installUpdate(downloadPath);
                
                progress.report({ increment: 100, message: '更新完成' });
            });
            
            // 提示重启
            const restart = await vscode.window.showInformationMessage(
                '✅ 更新已完成，需要重启VS Code才能生效。',
                '立即重启',
                '稍后重启'
            );
            
            if (restart === '立即重启') {
                await vscode.commands.executeCommand('workbench.action.reloadWindow');
            }
            
        } catch (error) {
            vscode.window.showErrorMessage(`❌ 更新失败: ${error.message}`);
        }
    }

    /**
     * 下载文件
     * @param {string} url 
     * @param {string} dest 
     * @param {vscode.Progress} progress 
     * @returns {Promise<void>}
     */
    downloadFile(url, dest, progress) {
        return new Promise((resolve, reject) => {
            const file = fs.createWriteStream(dest);
            
            https.get(url, {
                headers: { 'User-Agent': 'VSCode-Extension-Updater' }
            }, (response) => {
                if (response.statusCode !== 200) {
                    reject(new Error(`HTTP ${response.statusCode}`));
                    return;
                }
                
                const totalSize = parseInt(response.headers['content-length'], 10);
                let downloadedSize = 0;
                
                response.on('data', (chunk) => {
                    downloadedSize += chunk.length;
                    if (totalSize) {
                        const percent = Math.floor((downloadedSize / totalSize) * 60); // 10%到70%之间
                        const downloadedKB = Math.round(downloadedSize / 1024);
                        const totalKB = Math.round(totalSize / 1024);
                        progress.report({ 
                            increment: percent, 
                            message: `下载中 ${downloadedKB}KB / ${totalKB}KB` 
                        });
                    }
                });
                
                response.pipe(file);
                
                file.on('finish', () => {
                    file.close();
                    resolve();
                });
            }).on('error', (err) => {
                fs.unlink(dest, () => {});
                reject(err);
            });
        });
    }

    /**
     * 安装更新
     * @param {string} vsixPath 
     * @returns {Promise<void>}
     */
    installUpdate(vsixPath) {
        return new Promise((resolve, reject) => {
            const command = `code --install-extension "${vsixPath}" --force`;
            
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                } else {
                    console.log('安装输出:', stdout);
                    resolve();
                }
            });
        });
    }

    /**
     * 手动检查更新
     */
    manualCheck() {
        vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: '正在检查更新...',
            cancellable: false
        }, async (progress) => {
            try {
                progress.report({ increment: 30 });
                const latestVersion = await this.getLatestVersion();
                progress.report({ increment: 60 });
                
                if (this.compareVersions(latestVersion, this.currentVersion) > 0) {
                    progress.report({ increment: 100 });
                    this.promptUpdate(latestVersion);
                } else {
                    progress.report({ increment: 100 });
                    vscode.window.showInformationMessage(`✅ 当前已是最新版本 ${this.currentVersion}`);
                }
            } catch (error) {
                vscode.window.showErrorMessage(`❌ 检查更新失败: ${error.message}`);
            }
        });
    }
}

module.exports = ExtensionUpdater;