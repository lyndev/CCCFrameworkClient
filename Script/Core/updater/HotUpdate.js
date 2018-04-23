/*******************************************************************************
Copyright (C), 2015-2019, RaTo Tech. Co., Ltd.
文 件 名: HotUpdate.js
作    者: 刘伏波
创建日期: 2018-01-08
完成日期: 
功能描述: 
其它相关: 
修改记录: 
*******************************************************************************/

// 日志文件名
var LOG_FILE_NAME = 'HotUpdate.js.log'

var UIUpdate = require('UIUpdate')
var HotUpdateHelper =  require('HotUpdateHelper')

/*
    // 在 jsb-default工程下 main.js 的开头添加如下代码
    if (cc.sys.isNative) {
        var hotUpdateSearchPaths = cc.sys.localStorage.getItem('HotUpdateSearchPaths');
        if (hotUpdateSearchPaths) {
            jsb.fileUtils.setSearchPaths(JSON.parse(hotUpdateSearchPaths));
        }
    }
*/

var ENABLE_OLD_UPDATE = false
cc.Class({
    extends: cc.Component,

    properties: {
        EnableHotUpdate: true,
        panel: UIUpdate,
        manifestUrl: cc.RawAsset,
        updateUI: cc.Node,
        _updating: false,
        _canRetry: false,
        _storagePath: ''
    },

    // use this for initialization
    onLoad: function () {
        // Hot update is only available in Native build
        if (!cc.sys.isNative) {
            cc.director.loadScene("main")
            return;
        }

        if (cc.sys.os === cc.sys.OS_WINDOWS || cc.sys.os === cc.sys.OS_OSX) {
            if(!this.EnableHotUpdate){
                cc.log("pc端或者MacOS端关闭了热更新哦！如需开启请修改HotUpdate脚本")
                cc.director.loadScene("main")
                return
            }else {
                cc.log("pc端或者MacOS端开启了热更新哦！如需开启请修改HotUpdate脚本")
            }
        }
        
        var _paths = jsb.fileUtils.getSearchPaths()
        var _show = ""
        _paths.forEach(function(path){
            _show = _show + path + "@\n"
        })
        this.panel.pathLabel.string = _show
        this.m_bUpdated = false

        var _dir = ""
        if(ENABLE_OLD_UPDATE){
            _dir = "CCCGameClientFramework_OLD"
        } else {
            _dir = "CCCGameClientFramework_OLD"
        }
        this._storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + _dir);
        jsb.fileUtils.addSearchPath(this._storagePath, true)
        cc.log('Storage path for remote asset : ' + this._storagePath);
        //this.panel.pathLabel.string = jsb.fileUtils.getWritablePath()

        // Setup your own version compare handler, versionA and B is versions in string
        // if the return value greater than 0, versionA is greater than B,
        // if the return value equals 0, versionA equals to B,
        // if the return value smaller than 0, versionA is smaller than B.
        this.versionCompareHandle = function (versionA, versionB) {
            cc.log("JS Custom Version Compare: version A is " + versionA + ', version B is ' + versionB);
            var vA = versionA.split('.');
            var vB = versionB.split('.');
            for (var i = 0; i < vA.length; ++i) {
                var a = parseInt(vA[i]);
                var b = parseInt(vB[i] || 0);
                if (a === b) {
                    continue;
                }
                else {
                    return a - b;
                }
            }
            if (vB.length > vA.length) {
                return -1;
            }
            else {
                return 0;
            }
        };

        this.panel.fileProgress.progress = 0;
        this.panel.byteProgress.progress = 0;

      
        if(ENABLE_OLD_UPDATE){
            this.createAssetsManager()
            this.hotUpdate()
        } else {
            this.m_HotUpdateHelper = new HotUpdateHelper()
            this.m_HotUpdateHelper.init(this)
        }
    },

    // 开始更新补丁
    startUpdate:function(){
        // 销毁原来的更新器
        cc.log("startUpdate b:", this.uuid)
        this.destroyAssetsManager()
        // 构建新的更新器
        var _curUpdateVerionsURL = this.m_HotUpdateHelper.getNextNeedUpdateVersioninfo()
        var _curUpdateSubGameType = this.m_HotUpdateHelper.getCurUpdateSubGameType()
        if(_curUpdateVerionsURL){
            this.m_bUpdated = true
            cc.log("当前更新游戏类型:", _curUpdateSubGameType)
            this.createAssetsManager(_curUpdateSubGameType, _curUpdateVerionsURL.url)
            // 启动更新
            this.hotUpdate()
        } else {
            cc.log("获取了一条空的更新项目，说明更新完毕了")

            // 根据是否更新过来判断是重启app还是进入游戏
            if(this.m_bUpdated){
                // 重启app
                this.restartApp()
            } else {
                // 进入游戏
                //this.enterGame()
            }
        }
    },

    // 进入游戏逻辑
    enterGame:function(){
        cc.log("检查更新完毕,进入游戏。")
        cc.director.loadScene("main")
    },

    // 创建更新器
    createAssetsManager:function(subGameType, url){
        // Init with empty manifest url for testing custom manifest
        // test res_daer
        var _downloadPath = ""
        var _manifestUrlPath = ""
        if(ENABLE_OLD_UPDATE){
            _downloadPath = this._storagePath
        } else {
            _downloadPath = this._storagePath + this.m_HotUpdateHelper.getSubGameStoragePath(subGameType)
            _manifestUrlPath = cc.url.raw(this.m_HotUpdateHelper.getSubGameLocalManifestPath(subGameType)) 
            _manifestUrlPath = _manifestUrlPath + "+" + url
        }

        cc.log("开始热更：")
        cc.log("开始热更_downloadPath：", _downloadPath)
        cc.log("开始热更：_manifestUrlPath", _manifestUrlPath)

        this._am = new jsb.AssetsManager(_manifestUrlPath, _downloadPath, this.versionCompareHandle);
        if (!cc.sys.ENABLE_GC_FOR_NATIVE_OBJECTS) {
            this._am.retain();
        }

        var panel = this.panel;
        // Setup the verification callback, but we don't have md5 check function yet, so only print some message
        // Return true if the verification passed, otherwise return false
        this._am.setVerifyCallback(function (path, asset) {
            // When asset is compressed, we don't need to check its md5, because zip file have been deleted.
            var compressed = asset.compressed;
            // Retrieve the correct md5 value.
            var expectedMD5 = asset.md5;
            // asset.path is relative path and path is absolute.
            var relativePath = asset.path;
            // The size of asset file, but this value could be absent.
            var size = asset.size;
            if (compressed) {
                panel.info.string = "Verification passed : " + relativePath;
                return true;
            }
            else {
                panel.info.string = "Verification passed : " + relativePath + ' (' + expectedMD5 + ')';
                return true;
            }
        });

        this.panel.info.string = 'Hot update is ready, please check or directly update.';

        if (cc.sys.os === cc.sys.OS_ANDROID) {
            // Some Android device may slow down the download process when concurrent tasks is too much.
            // The value may not be accurate, please do more test and find what's most suitable for your game.
            this._am.setMaxConcurrentTask(2);
            this.panel.info.string = "Max concurrent tasks count have been limited to 2";
        }
    },

    destroyAssetsManager:function(){
        if (this._updateListener) {
            cc.eventManager.removeListener(this._updateListener);
            this._updateListener = null;
        }
        if (this._am && !cc.sys.ENABLE_GC_FOR_NATIVE_OBJECTS) {
            this._am.release();
        }
    },

    // 检测是否下载完成
    isAllDownloadFinish:function(){
        var _gamesType = this.m_HotUpdateHelper.getAllGamesType()
        if(this.gameTypeIndex == _gamesType.length && this.curUpdateTotalCount == this.curUpdateIndex){
            return true
        }
        return false
    },

    // 下载指定的游戏版本如下方式：
    /*downloadTest:function(){
        this.m_HotUpdateHelper.downloadOneSubGameRes("game_mj")
    },*/

    checkCb: function (event) {
        cc.log('Code: ' + event.getEventCode());
        switch (event.getEventCode())
        {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                this.panel.info.string = "No local manifest file found, hot update skipped.";
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                this.panel.info.string = "Fail to download manifest file, hot update skipped.";
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                this.panel.info.string = "Already up to date with the latest remote version.";
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                this.panel.info.string = 'New version found, please try to update.';
                this.panel.checkBtn.active = false;
                this.panel.fileProgress.progress = 0;
                this.panel.byteProgress.progress = 0;
                break;
            default:
                return;
        }
        
        cc.eventManager.removeListener(this._checkListener);
        this._checkListener = null;
        this._updating = false;
    },

    updateCb: function (event) {
        var needRestart = false;
        var failed = false;
        switch (event.getEventCode())
        {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                this.panel.info.string = 'No local manifest file found, hot update skipped.';
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                this.panel.byteProgress.progress = event.getPercent();
                this.panel.fileProgress.progress = event.getPercentByFile();

                this.panel.fileLabel.string = event.getDownloadedFiles() + ' / ' + event.getTotalFiles();
                this.panel.byteLabel.string = event.getDownloadedBytes() + ' / ' + event.getTotalBytes();

                var msg = event.getMessage();
                if (msg) {
                    this.panel.info.string = 'Updated file: ' + msg;
                    // cc.log(event.getPercent()/100 + '% : ' + msg);
                }
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                this.panel.info.string = 'Fail to download manifest file, hot update skipped.';
                failed = true;
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                this.panel.info.string = 'Already Already up to date with the latest remote version.';
                cc.log("版本相同无需更新,跳过，继续更新下一个。")
                if(!ENABLE_OLD_UPDATE){
                    this.m_HotUpdateHelper.saveCurUpdateVersionInfo()
                    this.m_HotUpdateHelper.removeOneUpdatedVerionsInfo()
                    this._updating = false;
                    // 搜索路径更新
                    //this.updateSearchPath()
                    this.startUpdate()
                }
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                this.panel.info.string = 'Update finished. ' + event.getMessage();
                if(!ENABLE_OLD_UPDATE){
                    // 继续更新下一个
                    cc.log("当前更新完毕,继续更新下一个")
                    this.m_HotUpdateHelper.saveCurUpdateVersionInfo()
                    this.m_HotUpdateHelper.removeOneUpdatedVerionsInfo()
                    this._updating = false;
                    // 搜索路径更新
                    //this.updateSearchPath()
                    this.startUpdate()
                } else{
                    needRestart = true
                }
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
                this.panel.info.string = 'Update failed. ' + event.getMessage();
                //this.panel.retryBtn.active = true;
                this._updating = false;
                this._canRetry = true;
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING:
                this.panel.info.string = 'Asset update error: ' + event.getAssetId() + ', ' + event.getMessage();
                break;
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                this.panel.info.string = event.getMessage();
                break;
            default:
                break;
        }

        if(ENABLE_OLD_UPDATE && needRestart){
            this.panel.info.string = "正在重启app和更新路径";
            this.updateSearchPath()
            this.restartApp()
        }
    },

    restartApp:function(){
        this.destroyAssetsManager()
        cc.audioEngine.stopAll();
        cc.game.restart();
    },

    updateSearchPath:function(){
       // Prepend the manifest's search path
        var searchPaths = jsb.fileUtils.getSearchPaths();
        var newPaths = this._am.getLocalManifest().getSearchPaths();
        console.log("更新资源路径列表：", JSON.stringify(newPaths));
        
        Array.prototype.unshift(searchPaths, newPaths);
        

        // This value will be retrieved and appended to the default search path during game startup,
        // please refer to samples/js-tests/main.js for detailed usage.
        // !!! Re-add the search paths in main.js is very important, otherwise, new scripts won't take effect.
        cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
        jsb.fileUtils.setSearchPaths(searchPaths);
    },

    retry: function () {
        if (!this._updating && this._canRetry) {
            this.panel.retryBtn.active = false;
            this._canRetry = false;
            
            this.panel.info.string = 'Retry failed Assets...';
            this._am.downloadFailedAssets();
        }
    },
    
    checkUpdate: function () {
        if (this._updating) {
            this.panel.info.string = 'Checking or updating ...';
            return;
        }
        if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
            this._am.loadLocalManifest(this.manifestUrl);
        }
        if (!this._am.getLocalManifest() || !this._am.getLocalManifest().isLoaded()) {
            this.panel.info.string = 'Failed to load local manifest ...';
            return;
        }
        this._checkListener = new jsb.EventListenerAssetsManager(this._am, this.checkCb.bind(this));
        cc.eventManager.addListener(this._checkListener, 1);

        this._am.checkUpdate();
        this._updating = true;
    },

    hotUpdate: function () {
        if (this._am && !this._updating) {
            this._updateListener = new jsb.EventListenerAssetsManager(this._am, this.updateCb.bind(this));
            var self = this
            cc.eventManager.addListener(this._updateListener, 1);

            var begin = function(){
                cc.log("正式开始下载更...")
                self._failCount = 0;
                self._am.update();
                self.panel.updateBtn.active = true;
                self._updating = true;
            }

            if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
                cc.log("=========没有初始化本地的manifestUrl配置文件, 重新加载========")
                if(ENABLE_OLD_UPDATE){
                    this._am.loadLocalManifest(this.manifestUrl);
                    begin()
                } else {
                    var _curUpdateSubGameType = this.m_HotUpdateHelper.getCurUpdateSubGameType()
                    var _path = this.m_HotUpdateHelper.getSubGameStoragePath(_curUpdateSubGameType)
                    cc.loader.loadRes(_path, cc.RawAsset, function(error, manifestUrl){
                        this._am.loadLocalManifest(this.manifestUrl);
                        begin()
                    })
                } 
            } else {
                begin()
            }
        }
    },
    
    show: function () {
        if (this.updateUI.active === false) {
            this.updateUI.active = true;
        }
    },

    onDestroy: function () {
        this.destroyAssetsManager()
    }
});
