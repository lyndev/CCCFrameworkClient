/*******************************************************************************
Copyright (C), 2016, RaTo Tech. Co., Ltd.
文 件 名: UIManager.js
作    者: 刘伏波
创建日期: 2016-10-13
完成日期: 
功能描述: 
其它相关: 
修改记录: 
*******************************************************************************/

// 日志文件名
var LOG_FILE_NAME = 'UIManager.js.log'

var GameType       = require("GameType")
var MessageManager = require("MessageManager")
var BaseManager    = require("BaseManager")

var GameUIRootNodeType = {}
GameUIRootNodeType.Bottom = 1    // 最底层ＵＩ
GameUIRootNodeType.Normal = 2    // 普通UI的父节点类型
GameUIRootNodeType.Tips   = 3    // tipsUI的父节点类型
GameUIRootNodeType.Guide  = 4    // 新手引导的父节点类型
GameUIRootNodeType.Notice = 5    // 公告的父节点类型


var UIPATH_CONFG = "game_main/Prefabs/ui/"

var UIManager = cc.Class({
    extends: BaseManager,
    m_uiList: null,

    init: function() {
        cc.log("UIManager Init")
        this.m_uiList = {}
        this.createGameRootLayer()
    },

    openUI: function(msg) {
        var _uiName = msg.name
        var _bUpdate = msg.update
        var _uiLayerType = msg.uiType || GameUIRootNodeType.Normal
        var _willZIndex = msg.zorder
        var _bIsLoadFinish = this.isLoadFinish(_uiName)
        this.msg = msg
        if(!_bIsLoadFinish){
            cc.log("已经加载完成",_uiName)
            return
        }
        var _bOpen = this.isOpen(_uiName)

        // UI已经打开
        if (_bOpen) {
            this.openUIOtherArgsHandler(msg)
            var _gameScene = cc.director.getScene()
            var _uiNode = cc.Client.UIHelper.FindNodeByName(_gameScene, _uiName)
            if(_uiNode) {
                // 更新UI
                if (_bUpdate) {
                    var _uiComponent = _uiNode.getComponent(_uiName)
                    if (_uiComponent) {
                        cc.log('update ui data :%s', _uiName)
                        _uiComponent.updateUIData(msg)
                    } else {
                        cc.error("not find ui node component :%s", _uiName)    
                    }
                    this.setNodeZIndex(_uiNode, _uiLayerType, _willZIndex)
                    cc.Client.MessageManager.sendLocalMsg(cc.GameMsg.MSGID.CC_OPEN_UI, {strUIName : _uiName, state : GameType.UI_OPERATOR_TYPE.OPEN})
                // 显示UI
                } else {
                    this.showUIByNode(_uiNode, true)
                    cc.Client.MessageManager.sendLocalMsg(cc.GameMsg.MSGID.CC_OPEN_UI, {strUIName : _uiName, state : GameType.UI_OPERATOR_TYPE.OPEN})
                }
            } else {
                cc.error("not find ui node :%s", _uiName)
            }

        // 创建一个新的UI
        } else {
            var _msg = msg
            var _prefabPath = UIPATH_CONFG + _uiName
            if(!this.m_uiList[_uiName]){
                this.m_uiList[_uiName] = {}
            }
            this.m_uiList[_uiName].name = _msg.name 
            this.m_uiList[_uiName].loadFinish = false
            var that = this
            cc.loader.loadRes(_prefabPath, function (err, prefab) {
                var _newUIRoot = that.createUI(prefab, _msg)
                if (_newUIRoot) {
                    that.addToUIRoot(_newUIRoot, _uiLayerType, _willZIndex)
                    that.m_uiList[_uiName] = {}
                    that.m_uiList[_uiName].name = _msg.name
                    that.m_uiList[_uiName].uiType = _uiLayerType
                    // 加载完成的标记
                    that.m_uiList[_uiName].loadFinish = true
                    cc.Client.MessageManager.sendLocalMsg(cc.GameMsg.MSGID.CC_OPEN_UI, {strUIName : _uiName, state : GameType.UI_OPERATOR_TYPE.OPEN})
                    if(_msg.callback){
                        _msg.callback()
                    }
                } else {
                    cc.error("load ui prefab fail :%s", _prefabPath)
                }
                that.openUIOtherArgsHandler(_msg)
            })
        }
    },

    openUIOtherArgsHandler: function(msg){

        if(msg.closeMsg){
            this.closeUI(msg.closeMsg)
        }

        if(msg.hideMsg){
            this.showUIByName(msg.hideMsg.name, msg.hideMsg.bShow)
        }
    },

    isLoadFinish(uiName){
        if(this.m_uiList[uiName]){
            return this.m_uiList[uiName].loadFinish
        }
        return true
    },

    closeUI: function(msg){
        var _gameScene = cc.director.getScene()
        var _uiName = msg.name
        var _bInList = this.m_uiList[_uiName]
        if (_bInList) {
            var uiType = _bInList.uiType
            if(uiType){
                this.decreaseRootLayerZIndex(uiType)
            }
            this.m_uiList[_uiName] = null
            delete this.m_uiList[_uiName]
        }
        
        var _uiNode = cc.Client.UIHelper.FindNodeByName(_gameScene, _uiName)
        if (_uiNode) {
            _uiNode.destroy()
            cc.log("<<<<<<<<< close ui : %s >>>>>>>>>>", _uiName)
        } else {
            cc.log("close ui fail: ", _uiName)
        }

        if(msg.hideMsg){
            this.showUIByName(msg.hideMsg.name, msg.hideMsg.bShow)
        }
    },

    isOpen: function(uiName){
        if(this.m_uiList[uiName]){
            var _uiName = this.m_uiList[uiName].name
            if(_uiName === uiName) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    },

    createUI: function(prefab, msg){
        var _newUIRoot = cc.instantiate(prefab)
        var _uiName =  msg.name
        if (_newUIRoot) {
            _newUIRoot.name = _uiName
            var _uiComponent = _newUIRoot.getComponent(_uiName)
            if (_uiComponent) {
                if(typeof _uiComponent.init === 'undefined'){
                    cc.error("get ui component init function fail, not find :%s", _uiName)
                } else {
                    _uiComponent.init(msg)
                }
            } else {
                cc.error("get ui component fail", _uiName)                        
            }
            return _newUIRoot
        }
        return null
    },

    addToUIRoot: function(node, layerType, willZIndex){
        if (node) {
            var _uiLayerType  = layerType || GameUIRootNodeType.Normal
            var rootLayer = this.getRootLayerByType(_uiLayerType)
            if (rootLayer) {
                node.parent = rootLayer 
                node.setPosition(0, 0)
                this.setNodeZIndex(node, _uiLayerType, willZIndex)
            }
        }
    },

    setNodeZIndex(uiNode, layerType, willZIndex){
        if(uiNode){
            if(willZIndex){
                uiNode.zIndex = willZIndex
            } else {
                var _zindex = this.getRootLayerChildZIndex(layerType)
                uiNode.zIndex = _zindex
                this.increaseRootLayerZIndex(layerType)       
            }
        }
    },

    getUIByName: function(uiName) {
        var _gameScene = cc.director.getScene()
        var _uiNode = cc.Client.UIHelper.FindNodeByName(_gameScene, uiName)
        if(_uiNode){
            return _uiNode
        } else {
            cc.error("get ui fail :%s", uiName)
        }
    },

    showUIByName: function(uiName, bShow){
        var _uiNode = this.getUIByName(uiName)
        if(_uiNode){
            cc.log("显示或者隐藏了一个UI:", uiName, bShow)
            this.showUIByNode(_uiNode, bShow)
        } else {
            cc.log("show ui fail, not find the ui:%s", uiName)
        }
    },

    removeUIName: function(uiName){
        this.m_uiList[uiName] = null
    },

    showUIByNode: function(uiNode, bShow) {
        if (uiNode) {
           uiNode.active = bShow
        } else {
            cc.error("showUI fail uiNode is null")
        }
    },


    // 创建游戏的父节点层
    createGameRootLayer: function(){
        this.m_uiRootNodeList = {}
        var GameRootNodeTypeList = GameUIRootNodeType
        if(GameRootNodeTypeList){
            for(var uiRootType in GameRootNodeTypeList){
                var rootNode = new cc.Node()
                if(rootNode){
                    var _gameScene = cc.director.getScene()
                    var _canvas = cc.find("Canvas", _gameScene)
                    if(_canvas){
                        rootNode.zIndex = GameRootNodeTypeList[uiRootType]
                        rootNode.setPosition(0, 0)
                        rootNode.width = _canvas.width
                        rootNode.height = _canvas.height
                        rootNode.parent = _canvas
                        var key = GameRootNodeTypeList[uiRootType]
                        this.m_uiRootNodeList[key] = {}
                        this.m_uiRootNodeList[key].node = rootNode
                        this.m_uiRootNodeList[key].zIndex  = key
                    }
                }
            }
        }else{
            cc.log("创建游戏的父节点层失败")  
        }
    },

    // 根据UI类型获取父节点
    getRootLayerByType: function(layerType){
        var _layerType = layerType || GameUIRootNodeType.Normal
        return this.m_uiRootNodeList[_layerType] ? this.m_uiRootNodeList[_layerType].node : null
    },

    // 根据UI类型获取父节点的当前子节点的Z值
    getRootLayerChildZIndex: function(layerType){
        var _layerType = layerType || GameUIRootNodeType.Normal
        return this.m_uiRootNodeList[_layerType] ? this.m_uiRootNodeList[_layerType].zIndex : 0
    },

    // 把当前节点Z值增加一
    increaseRootLayerZIndex: function(layerType){
        this.setLayerZIndex(layerType, 1)
    },

    // 把当前的节点的Z值减一
    decreaseRootLayerZIndex: function(layerType){
        this.setLayerZIndex(layerType, -1)
    },

    setLayerZIndex(type, factor){
        var _layerType = type || GameUIRootNodeType.Normal
        if(this.m_uiRootNodeList[_layerType]){
            this.m_uiRootNodeList[_layerType].zIndex += factor
            if(this.m_uiRootNodeList[_layerType].zIndex < 1){
                this.m_uiRootNodeList[_layerType].zIndex = 1
            } 
        }
    },

    // 关闭所有的界面,除了uiNameList
    closeAllUI: function(uiNameList){
        for (var _uiName in this.m_uiList) {
            if(this.m_uiList[_uiName]){
                if(uiNameList){
                   if(uiNameList[_uiName]){
                        continue
                   }
                }
                if(this.m_uiList[_uiName]&& this.m_uiList[_uiName].name){
                    this.closeUI(this.m_uiList[_uiName])
                }
            }
        }
        for(var key in this.m_uiRootNodeList){
            var nodeInfo = this.m_uiRootNodeList[key]
            if(nodeInfo){
                nodeInfo.node.removeAllChildren()
            }
        }
    },
})