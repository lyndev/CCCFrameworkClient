/*******************************************************************************
Copyright (C), 2015-2019, RaTo Tech. Co., Ltd.
文 件 名: UILobby.js
作    者: 刘伏波
创建日期: 2017-12-20
完成日期: 
功能描述: 
其它相关: 
修改记录: 
*******************************************************************************/

// 日志文件名
var LOG_FILE_NAME = 'UILobby.js.log'

var UIBase = require("UIBase")

cc.Class({
    extends: UIBase,

    properties: {
        txtName:cc.Label,
        txtCoin:cc.Label,
        spHead: cc.Sprite,
        btnZJH:cc.Node,
        btnMJ:cc.Node,
        btnPOKER:cc.Node,
        btnCustom:cc.Node,

        btnEmail:cc.Node,
        btnVIP:cc.Node,
        btnTask:cc.Node,
        btnShop:cc.Node,
        btnBag:cc.Node,
        btnActivity:cc.Node,
        btnMore:cc.Node,
    },

    init: function(msg){
        this.setPlayerInfo()
        var self = this
        globalEvent.on("event_wechat_head_image", function(event){
            self.setHead(event)
        }, this)
        this.setHead()
    },

    onLoad () {
    	cc.log("UILobby on load")
    },

    start () {
        cc.Client.UIStackManager.pushUI(this.__classname__, cc.Client.GameType.UIActionType.Hide)
    	cc.log("UILobby on start")

        cc.Client.UIHelper.AddClickEvent(this.btnZJH, this.node, "onZJHBtnClick", this.__classname__)
        cc.Client.UIHelper.AddClickEvent(this.btnMJ, this.node, "onMJBtnClick", this.__classname__)
        cc.Client.UIHelper.AddClickEvent(this.btnPOKER, this.node, "onPOKERBtnClick", this.__classname__)
        cc.Client.UIHelper.AddClickEvent(this.btnCustom, this.node, "onCustionRoomBtnClick", this.__classname__)


        cc.Client.UIHelper.AddClickEvent(this.btnEmail, this.node, "onLobbySubBtnClick", this.__classname__)
        cc.Client.UIHelper.AddClickEvent(this.btnVIP, this.node, "onLobbySubBtnClick", this.__classname__)
        cc.Client.UIHelper.AddClickEvent(this.btnTask, this.node, "onLobbySubBtnClick", this.__classname__)
        cc.Client.UIHelper.AddClickEvent(this.btnShop, this.node, "onLobbySubBtnClick", this.__classname__)
        cc.Client.UIHelper.AddClickEvent(this.btnBag, this.node, "onLobbySubBtnClick", this.__classname__)
        cc.Client.UIHelper.AddClickEvent(this.btnActivity, this.node, "onLobbySubBtnClick", this.__classname__)
        cc.Client.UIHelper.AddClickEvent(this.btnMore, this.node, "onLobbySubBtnClick", this.__classname__)

    },

    closeThisUI:function(event){
        var msg = {
            name : this.__classname__,
        }
        cc.Client.UIManager.closeUI(msg)
    },

    openFightUI:function(event){
        var msg = {
            name : "UIFight",
        }
        cc.Client.UIManager.openUI(msg)  
    },

    onZJHBtnClick:function(event){
        var msg = {
            name : "UIZJHFight",
        }
        cc.Client.UIManager.openUI(msg)    
    },

    onMJBtnClick:function(event){
        

    },

    onPOKERBtnClick:function(event){
        cc.Client.WechatPlatformManager.shareCaptureScreen()

    },

    onCustionRoomBtnClick:function(event){
        var msg = {}
        msg.name = "UIEnterCustomRoom",
        cc.Client.UIManager.openUI(msg)
    },

    onLobbySubBtnClick:function(event){
        var _name = event.target.name
        switch(_name){
            case "btnEmail":
                 cc.Client.WechatPlatformManager.ShareTextTotFriends("内容分享测试")
                break
            case "btnVIP":
                 cc.Client.WechatPlatformManager.ShareTextTotFriendCircle("内容分享测试")
                break
            case "btnTask":

                break
            case "btnShop":

                break
            case "btnBag":

                break
            case "btnActivity":

                break
            case "btnMore":
                cc.Client.GameWebsocket.closeConnect()
                break
        }

    },

    setHead:function(event) {
        if(event){
            var _data = event.getUserData()
            this.spHead.spriteFrame = _data.headInfo.prefab.getComponent(cc.Sprite).spriteFrame
        } else {
            var _url = cc.Client.PlayerManager.getHeadURL()
            var _role_id = cc.Client.PlayerManager.getRoleId()   
            var _headInfo = cc.Client.WechatHeadImageManager.getHeadSprite(_url, _role_id)
            if(_headInfo){
                this.spHead.spriteFrame = _headInfo.spriteFrame
            }
        }
    },

    setPlayerInfo:function(){
        this.txtName.string = cc.Client.PlayerManager.getRoleName()
        this.txtCoin.string = cc.Client.PlayerManager.getCoin()
    },

    onDestroy:function(){
        this._super()
        cc.Client.UIStackManager.popUI(this.__classname__)
    },
});
