/*******************************************************************************
Copyright (C), 2015-2019, RaTo Tech. Co., Ltd.
文 件 名: HotUpdateHelper.js
作    者: 刘伏波
创建日期: 2018-01-05
完成日期: 
功能描述: 迭代更新辅助脚本
其它相关: 
修改记录: 
*******************************************************************************/

// 日志文件名
var LOG_FILE_NAME = 'HotUpdateHelper.js.log'

var REMOTE_CONFIG_URL = "http://192.168.1.41:80/CCCGameClientFramework/LuzhouqipaiVersions.json"

var GAMES_TYPE = 
[
	"game_main",
	"game_daer", 
	"game_mj"
]

// 游戏模块的版本保存key
var GAME_VESION_KEYS = {}
GAME_VESION_KEYS["game_main"] = "version_game_main"
GAME_VESION_KEYS["game_daer"] = "version_game_daer"
GAME_VESION_KEYS["game_mj"]   = "version_game_mj"

// 游戏模块的是否下载key
var GAME_DOWNLOAD_KEYS = {}
GAME_DOWNLOAD_KEYS["game_main"] = "download_game_main"
GAME_DOWNLOAD_KEYS["game_daer"] = "download_game_daer"
GAME_DOWNLOAD_KEYS["game_mj"]   = "download_game_mj"

// json配置文件配置的字段
var GAME_JSON_KEYS = {}
GAME_JSON_KEYS["game_main"] = "Versions_GameMain"
GAME_JSON_KEYS["game_daer"] = "Versions_GameDaer"
GAME_JSON_KEYS["game_mj"]   = "Versions_GameMJ"

// 各个子游戏模块下载后解压的目录
var GAME_DOWNLOAD_PATH = {}
GAME_DOWNLOAD_PATH["game_main"] = "/res/raw-assets/resources/game_main"
GAME_DOWNLOAD_PATH["game_daer"] = "/res/raw-assets/resources/game_daer"
GAME_DOWNLOAD_PATH["game_mj"]   = "/res/raw-assets/resources/game_mj"

// 各个子游戏模块的project配置文件路径
var GAME_MANIFEST_PATH = {}
GAME_MANIFEST_PATH["game_main"] = "resources/game_main/project.manifest"
GAME_MANIFEST_PATH["game_daer"] = "resources/game_daer/project.manifest"
GAME_MANIFEST_PATH["game_mj"]   = "resources/game_mj/project.manifest"

var UPDATE_PATTERN = {}
UPDATE_PATTERN.UPDATE = "update"
UPDATE_PATTERN.DOWNLOAD = "download"

cc.Class({
	extends: cc.Component,
    properties: {
    	remoteConfigObj:"",
    },

	init:function(hotUpdateObj){
        this.hotUpdateObj = hotUpdateObj
        this.curUpdatePattern = UPDATE_PATTERN.UPDATE
        this.curDownloadGameType = ""

		this.setSubGameIsDownload("game_main", "0")
		this.setSubGameIsDownload("game_daer", "1")
		this.setSubGameIsDownload("game_mj", "1")

		this.getRemoteUpdateConfig()
	},

	// 获取远程配置文件
	getRemoteUpdateConfig :function(url){
		this.curUpdatePattern = UPDATE_PATTERN.UPDATE
		var xhr = new XMLHttpRequest();
		var self = this
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
			    var response = xhr.responseText
			    self.remoteConfigObj = JSON.parse(response)
			    console.log("json 下载结果", self.remoteConfigObj)
			    self.downloadRemoteConfigResult(true)
			}
		}

		xhr.open("GET", REMOTE_CONFIG_URL, true)
		xhr.send()
	},

	// 获取远程配置文件结果处理
	downloadRemoteConfigResult:function(rlt){
		if(rlt){
			cc.log("下载资源服务配置文件成功")
			var _willDownload = this.filterAllNeedUpdateVerions()
			for(var i = 0; i< GAMES_TYPE.length; i++){
				var subGameType = GAMES_TYPE[i]
				// 过滤掉没有下载标记的子游戏
				if(!this.isSubGameDownloaded(subGameType)){
					cc.log("过滤掉没有下载的游戏", subGameType)
					_willDownload[subGameType] = []
				}
				cc.log("过滤后，"+ subGameType+ ": " + _willDownload[subGameType].length + "个补丁需要更新。")
				_willDownload[subGameType].forEach((verionInfo)=>{
					cc.log(subGameType + ": " + verionInfo.version + " : " + verionInfo.url)
				})
			}
			this.m_canWillDownloadVersions = _willDownload
			this.hotUpdateObj.startUpdate()
		}
	},


	// 下载指定的子游戏模块
	downloadOneSubGameRes:function(subGameType){
		var xhr = new XMLHttpRequest();
		var self = this
		this.curDownloadGameType = subGameType
		this.curUpdatePattern = UPDATE_PATTERN.DOWNLOAD
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
			    var response = xhr.responseText
			    self.remoteConfigObj = JSON.parse(response)			   
				var _willDownload = self.filterAllNeedUpdateVerions()
				GAMES_TYPE.forEach((_subGameType) => {
					if(_subGameType != subGameType){
						_willDownload[_subGameType] = []
					}
				})

				self.m_canWillDownloadVersions = _willDownload
				if(_willDownload[subGameType]){
					cc.log("即将下载的游戏的数目", _willDownload[subGameType].length, subGameType)
					self.hotUpdateObj.startUpdate()
				} else {
					cc.log("该游戏模块没有可以下载的资源。")
				}
			}
		}

		xhr.open("GET", REMOTE_CONFIG_URL, true)
		xhr.send()
	},

	// 获取可以更新的所有子游戏的版本
	getAllCanUpdateVerions:function(){
		return this.m_canWillDownloadVersions
	},

	// 获取下一条需要更新的信息
	getNextNeedUpdateVersioninfo:function(){
		var subGameType = this.getCurUpdateSubGameType()

		if(this.curUpdatePattern == UPDATE_PATTERN.DOWNLOAD){
			if(this.m_canWillDownloadVersions[subGameType][0] == null){
				cc.log("下载完毕，写入已将下载标记")
				this.setSubGameIsDownload(this.curDownloadGameType, "1")
				this.curDownloadGameType = ""
			}
		}

		if(subGameType != ""){
			if(this.m_canWillDownloadVersions[subGameType] && this.m_canWillDownloadVersions[subGameType].length > 0){
				this.m_curUpdateVerionInfo = this.m_canWillDownloadVersions[subGameType][0]
				return this.m_curUpdateVerionInfo
			} else {
				return null
			}
		}
	},

	// 获取当前正在更新的版本信息
	saveCurUpdateVersionInfo:function(){
		var _curSubGameType = this.getCurUpdateSubGameType()
		if(_curSubGameType != ""){
			var _curVerion = this.m_curUpdateVerionInfo.version
			this.saveOneVersionAlreadyUpdate(_curSubGameType, _curVerion)
		} else {
			cc.log("游戏类型为空。")
		}
	},

	// 移除当前已经更新完成的一条
	removeOneUpdatedVerionsInfo:function(){
		var _gameKey = this.getCurUpdateSubGameType()
		this.m_canWillDownloadVersions[_gameKey].splice(0, 1)
		cc.log("移除一个更新完成的项目。", this.m_canWillDownloadVersions[_gameKey].length)
	},

	// 获取当前正在更新的游戏类型
	getCurUpdateSubGameType:function(){
		if(this.curUpdatePattern == UPDATE_PATTERN.UPDATE){
			for (var i = 0; i < GAMES_TYPE.length; i++) {
				var subGameType = GAMES_TYPE[i]
				if(this.m_canWillDownloadVersions[subGameType] && this.m_canWillDownloadVersions[subGameType].length > 0){
					return subGameType
				}
			}
		} else {
			return this.curDownloadGameType
		}
	},

	// 过滤出需要下载更新的子游戏的所有版本
	filterAllNeedUpdateVerions:function(){
		var _needUpdateVersions = {}
		var _remoteVersions = {}
		var self = this
		GAMES_TYPE.forEach((subGameType) => {
			var _jsonKey = GAME_JSON_KEYS[subGameType]
			var _subGameRemoteVerions = self.remoteConfigObj[_jsonKey]
			cc.log("游戏类型:" + subGameType + ": " + _subGameRemoteVerions.length + "个补丁需要更新。")
			if(_subGameRemoteVerions.length > 0){
				_remoteVersions[subGameType] = _subGameRemoteVerions.splice(0)
				var _subGameAlreadDownloadVersions = self.getSubGameAlreadyDownloadVersions(subGameType)
				if(_subGameAlreadDownloadVersions){
					cc.log("游戏类型:" + subGameType + ": " + _subGameAlreadDownloadVersions.length + "个补丁已经更新过了。")
					if(_subGameAlreadDownloadVersions.length > 0){

						// 打印
						_subGameAlreadDownloadVersions.forEach((alreadyVersion) => {
							// 这里的“version”的字段是json配置的字段
							cc.log("subGameType:" + subGameType + " 已经更新过的版本号：" + alreadyVersion)
						})

						// 过滤
						if(_remoteVersions[subGameType] && _remoteVersions[subGameType].length > 0){
							for (var i = _remoteVersions[subGameType].length - 1; i >= 0; i--) {
								var _verionInfo = _remoteVersions[subGameType][i]
								_subGameAlreadDownloadVersions.forEach((alreadyVersion) => {
									// 这里的“version”的字段是json配置的字段
									if(alreadyVersion == _verionInfo.version){
										_remoteVersions[subGameType].splice(i, 1)
									}
								})
							}
						}
					} else {
						cc.log("subGameType", subGameType + " 没有更新过版本")
					}
				} else {
					cc.log("subGameType", subGameType + " 没有更新过版本:" + _subGameAlreadDownloadVersions)
				}
			} else {
				_remoteVersions[subGameType] = []
			}
		})
		return _remoteVersions
	},

	// 检测存储空间检测是否够下载更新
	isUpdateAndDownMemoryEnough:function(){

	},
	
	// 检测存储空间检测是否够下载apk
	isAPKMemoryEnough:function(){

	},

	// 检测子游戏模块是否下载
	isSubGameDownloaded:function(subGameType){
		var _isDownload = cc.sys.localStorage.getItem(GAME_DOWNLOAD_KEYS[subGameType])
		if(_isDownload == "1"){
			cc.log("已将安装了的子游戏:", subGameType)
			return true
		}
		return false
	},

	// 获取子游戏模块当前需要下载的所有补丁版本的urls
	getSubGameNeedUpdateVerisons:function(subGameType){

	},

	// 获取已经下载了的子游戏模块的更新过的版本
	getSubGameAlreadyDownloadVersions:function(subGameType){
		var _data = cc.sys.localStorage.getItem(GAME_VESION_KEYS[subGameType])
		cc.log("getSubGameAlreadyDownloadVersions:", subGameType, _data)
		return JSON.parse(_data)
	},

	// 设置子游戏已经下载
	setSubGameIsDownload:function(subGameType, flag){
		cc.sys.localStorage.setItem(GAME_DOWNLOAD_KEYS[subGameType], flag)
	},

	// 保存游戏模块一个已将更新完成的版本号
	saveOneVersionAlreadyUpdate:function(subGameType, version){
		var _versions = this.getSubGameAlreadyDownloadVersions(subGameType)
		if(!_versions){
			cc.log("重置下载过的版本")
			_versions = []
		}

		// 是否已经添加过了 forEach不能在循环的时候中断
		var bAdded = false
		_versions.forEach((val)=>{
			if(val == version){
				cc.log("已经添加了此版本了:", version)
				bAdded = true
			}
		})
		
		if(bAdded){
			return
		}

		_versions.push(version)
		var _saveVerions = JSON.stringify(_versions)
		cc.log("保存一个更新过的版本" + subGameType + ": " + _saveVerions)
		cc.sys.localStorage.setItem(GAME_VESION_KEYS[subGameType], _saveVerions)
		var _str = this.getSubGameAlreadyDownloadVersions(subGameType)
		cc.log("保存后的所有版本:", subGameType, JSON.stringify(_str))
	},

	resetAllVersions:function(){
		var self = this
		GAMES_TYPE.forEach((subGameType) =>{
			var _saveVerions = JSON.stringify([])
			cc.sys.localStorage.setItem(GAME_VESION_KEYS[subGameType], _saveVerions)
			self.setSubGameIsDownload(subGameType, "0")
		})
	},

	allVersionsUpdated:function(){
		cc.log("所有游戏模块的补丁更新完毕")
	},

	getSubGameStoragePath:function(subGameType){
		return GAME_DOWNLOAD_PATH[subGameType]
	},

	getSubGameLocalManifestPath:function(subGameType){
		return GAME_MANIFEST_PATH[subGameType]
	},

	getAllGamesType:function()
	{
		return GAMES_TYPE
	},
})