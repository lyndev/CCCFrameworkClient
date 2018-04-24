/*******************************************************************************
Copyright (C), 2016, XXX Tech. Co., Ltd.
文 件 名: UINetConnect.js
作    者: lyn
创建日期: 2016-12-13
完成日期: 
功能描述: 
其它相关: 
修改记录: 
*******************************************************************************/

// 日志文件名
var LOG_FILE_NAME = 'UINetConnect.js.log'

var RECONNECT_TIME = 15
var RECOUNECT_COUNT = 2

cc.Class({
    extends: cc.Component,

    properties: {
        curReconnectTime : RECONNECT_TIME,
        labelContent: cc.Label,
        btnReconnenct: cc.Node,
        btnLabel: cc.Label,
    },

    init: function (msg) {
        this.m_curRemianCoounnectCount = RECOUNECT_COUNT
        if(msg.connecting){
            this.showOnlyContent()
        }

        if(this.btnReconnenct){
            cc.Client.UIHelper.AddClickEvent(this.btnReconnenct, this.node, "onReconnectNet", this.__classname__)
        }
        this.schedule(this.onClickTimeOutAutoConnect, 1)
    },

    updateUIData: function(msg){
        if(msg.bReconnectAgain){
            this.reShowConnect()
        }
    },
    
    onReconnectNet: function(event){
        var _bLogined = cc.Client.PlayerManager.isLogin()
        if(_bLogined){
            var _callback = function(){
                cc.log("重新登录")
                var message = cc.Client.MessageUtility.getMsgStruct(cc.GameMsg.MSGID.CS_LOGIN_REQRECONNECT)
                message.userId = cc.Client.PlayerManager.getUserId()
                message.token =  cc.Client.PlayerManager.getReconnectToken()
                cc.Client.GameWebsocket.sendToServer(cc.GameMsg.MSGID.CS_LOGIN_REQRECONNECT, message)
            }
            cc.Client.GameWebsocket.connect(null, _callback)
        } else {
            if(this.m_curRemianCoounnectCount > 0){
                this.m_curRemianCoounnectCount --
                cc.Client.GameWebsocket.connect()
                this.showOnlyContent()
            } else {
                var msg = {
                    name : "UINetConnect",
                }
                cc.Client.UIManager.closeUI(msg)  
            }
        }
  
    },

    onClickTimeOutAutoConnect: function(dt){
        if(this.curReconnectTime >= 0){
            this.curReconnectTime--
             this.btnLabel.string =  "重新连接(" + this.curReconnectTime + "s)"
            if(this.curReconnectTime == 0){
                cc.Client.GameWebsocket.connect()
                this.curReconnectTime = -1
                this.showOnlyContent()
            } 
        }
    },

    showOnlyContent:function(){
        this.btnReconnenct.active = false
        this.setNotice("正在连接服务器..., 剩余连接次数:" + this.m_curRemianCoounnectCount)
    },

    reShowConnect: function(msg){
        if(this.btnReconnenct){
            this.btnReconnenct.active = true
        }
        if(this.btnLabel){
            this.btnLabel.string =  "重新连接(" + RECONNECT_TIME + "s)"
        }
        this.setNotice("连接接失败,请检查网络后,重新连接。")
        this.curReconnectTime = RECONNECT_TIME
    },

    setNotice:function(content){
        if(this.labelContent){
            this.labelContent.string = content || "连接接失败,请检查网络后,重新连接。"
        }
    },

    // use this for initialization
    onLoad: function () {

    },
});
