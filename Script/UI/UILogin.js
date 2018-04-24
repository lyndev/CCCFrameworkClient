/*******************************************************************************
Copyright (C), 2015-2019, XXX Tech. Co., Ltd.
文 件 名: UILogin.js
作    者: lyn
创建日期: 
完成日期: 
功能描述: 登录UI逻辑
其它相关: 
修改记录: 
*******************************************************************************/

// 日志文件名
var LOG_FILE_NAME = 'UILogin.js.log'

var UIBase   = require("UIBase")
var GameType = require("GameType")

var TEST_ACCOUNT = []
TEST_ACCOUNT[0] = "d9c3b884-2850-4a5c-b4b1-e2a0385fa20c"
TEST_ACCOUNT[1] = "ecca9daa-33e7-41ff-b684-028f9e215b0d"
TEST_ACCOUNT[2] = "aff235b1-7aa5-4034-bb76-8dbab34f8e3f"
TEST_ACCOUNT[3] = "6faac9c3-4608-403c-b116-4526facbad5c"
TEST_ACCOUNT[4] = "42984730-6dc0-4246-a6e2-88244d148846"
TEST_ACCOUNT[5] = "090d3029-0016-4109-96b9-6845cde246e7"
TEST_ACCOUNT[6] = "0f40a278-4918-42e7-baec-9dd226b5d45f"

var LoginType = {
    Guest: 1,
    Wechat: 2,
}

var SERVER_CONFI_URL = "http://47.106.91.153/server_config.json"

cc.Class({
    extends: UIBase,

    properties: {
        btnLogin : cc.Node,
        btnWechat : cc.Node,
        toggleAccount:cc.ToggleGroup,
        toggleServer:cc.ToggleGroup,
        serverToggleNode:{default:[], type:cc.Node},
    }, 

    init: function(msg){
        cc.log("<UILogin> init")
        this.m_curAccountIndex = 0
        var self = this        
        cc.Client.MessageManager.register(this, cc.GameMsg.MSGID.SC_LOGIN_RESLOGINSUCCESS, function(msgId, msgData){            
            if(self.m_loginType == LoginType.Guest){
                var _data = {}
                _data.soleId = msgData.playerInfo.userName
                cc.sys.localStorage.setItem('guest_id', JSON.stringify(_data))
            }
            cc.Client.PlayerManager.setPlayerInfo(msgData)
            cc.Client.PlayerManager.setLogin(true)
            cc.Client.PlayerManager.setReconnectToken(msgData.token)
            self.recvLoginSuccessMsgHander(msgData)
        })

        globalEvent.on('WechatOnRespone', function(event){ 
            var _wechatinfo = cc.Client.WechatPlatformManager.getWechatInfo()
            self.sendWechatLoginMsg(_wechatinfo)            
        }, this);
    },

    onLoad: function () {
        cc.Client.UIStackManager.pushUI(this.__classname__, cc.Client.GameType.UIActionType.None)
        cc.Client.UIHelper.AddClickEvent(this.btnLogin, this.node, "sendGuestLoginMsg", this.__classname__)
        cc.Client.UIHelper.AddClickEvent(this.btnWechat, this.node, "onWechatBtnClick", this.__classname__)
        
        var self = this
        this.m_server_ip = []
        var _callback = function(data){
            cc.log("clas name", self.__classname__)
            var _data = JSON.parse(data)
            if(_data && _data.server_ip){
                for (var i = 0; i < _data.server_ip.length; i++) {
                    var _ip_config = _data.server_ip[i]
                    for (var key in _ip_config) {
                        var _new_data = {}
                        _new_data.name = key 
                        _new_data.ip =_ip_config[key]
                        cc.log("ip:", key, _ip_config[key])
                        var _node = self.serverToggleNode[i]
                        if(_node){
                            var _label = cc.Client.UIHelper.FindNodeByName(_node, "label")
                            if(_label){
                                _label.getComponent(cc.Label).string = key
                            } else {
                                cc.log("label not find")
                            }
                        } else {
                            cc.log("not find node")
                        }
                        self.m_server_ip.push(_new_data)
                    }
                }
                // 默认连接第一个
                var _ip = self.m_server_ip[0].ip
                cc.Client.GameWebsocket.connect(_ip)
            } else {
                cc.log("获取服务器配置失败")
            }
        }

        cc.Client.Utility.SendHttpRequest(SERVER_CONFI_URL, _callback, "server_config")
        
    },

    onLogin:function() {

    },

    loadProto:function(){
       
    },

    acccountToggle:function(event, data){
        cc.log(event.target.name)
        cc.log(data)
        this.m_curAccountIndex = Number(data)
    },

    serverToggle:function(event, data){
        var _ip = this.m_server_ip[Number(data)].ip
        cc.Client.GameWebsocket.connect(_ip)
    },
    
    sendGuestLoginMsg:function(event){
        this.m_loginType = LoginType.Guest
        var _data = cc.sys.localStorage.getItem('guest_id')
        var _soleId = null
        if(_data && _data != ""){
            _data = JSON.parse(_data)
            if(_data && _data.soleId){
                _soleId = _data.soleId
            }
        }

        if(TEST_ACCOUNT[this.m_curAccountIndex]){
            _soleId = TEST_ACCOUNT[this.m_curAccountIndex]
        }
        var message = cc.Client.MessageUtility.getMsgStruct(cc.GameMsg.MSGID.CS_LOGIN_REQLOGIN)
        message.plaformId = 0
        message.clientId  = cc.sys.os
        message.time      = 1500279579
        message.clientVer = "1.0.0"
        message.userName    = _soleId
        message.serverId    = 1
        cc.Client.GameWebsocket.sendToServer(cc.GameMsg.MSGID.CS_LOGIN_REQLOGIN, message)
    },

    sendWechatLoginMsg:function(msg_data){
        if(msg_data){
            var message = cc.Client.MessageUtility.getMsgStruct(cc.GameMsg.MSGID.CS_LOGIN_REQLOGIN)
            message.plaformId = 1
            message.serverId  = 1
            message.clientId  = cc.sys.os
            message.time      = 1500279579
            message.clientVer = "1.0.0"
            message.userName  = msg_data.openid
            message.roleName  = msg_data.nickname
            message.sex       = msg_data.sex
            message.headURL   = msg_data.headimgurl
            cc.Client.GameWebsocket.sendToServer(cc.GameMsg.MSGID.CS_LOGIN_REQLOGIN, message)
        }
    },

    onWechatBtnClick:function(){
        globalEvent.emit("WechatOnRespone")
        this.m_loginType = LoginType.Wechat
        cc.Client.WechatPlatformManager.wechatLogin() 
    },

    recvLoginSuccessMsgHander:function(msgData){
        // 登录界面
        var msg = {}
        msg.name = "UILogin"
        cc.Client.UIManager.closeUI(msg)

        // 登录界面
        msg.name = "UILobby",
        cc.Client.UIManager.openUI(msg)
    },

    onDestroy:function(){
        this._super()
        cc.Client.MessageManager.off(this)
        cc.Client.UIStackManager.popUI(this.__classname__)
    },
});
