/*******************************************************************************
Copyright (C), 2015-2019, RaTo Tech. Co., Ltd.
文 件 名: LobbyManager.js
作    者: 刘伏波
创建日期: 2018-04-04
完成日期: 
功能描述: 
其它相关: 
修改记录: 
*******************************************************************************/

// 日志文件名
var LOG_FILE_NAME = 'LobbyManager.js.log'

var BaseManager = require("BaseManager")

var LobbyManager = cc.Class({
    extends: BaseManager,

    ctor:function() {
    	this.m_playerInfo = null
    	this.m_serverTime = 0
    },

    init:function(msg){
    	var self = this
		cc.Client.MessageManager.register(this, cc.GameMsg.MSGID.SC_ROOM_RESENTERROOM, function(msgId, msgData){ 
			self.resEnterRoomHander(msgData)    
		})
    },

    resEnterRoomHander:function(msg_data){
    	if(!window.gFightMgr){
            cc.log("自己进入房间")

            var _msg = {}
            _msg.name = "UIEnterCustomRoom"
            cc.Client.UIManager.closeUI(_msg)

			var FIGHT_UI_NAMES = {}
			FIGHT_UI_NAMES[cc.Client.GameType.GameType.NN]   = ""
			FIGHT_UI_NAMES[cc.Client.GameType.GameType.MJ]   = ""
			FIGHT_UI_NAMES[cc.Client.GameType.GameType.DDZ]  = ""
			FIGHT_UI_NAMES[cc.Client.GameType.GameType.ZJH]  = "UIZJHFight"
			FIGHT_UI_NAMES[cc.Client.GameType.GameType.TANK] = ""

    		window.gFightMgr = cc.Client.FightManagerFactory.createFightManager(msg_data.gameType, msg_data)
    		window.gFightMgr.playerEnter(msg_data)

    		var _ui_msg = {}
    		_ui_msg.name = FIGHT_UI_NAMES[msg_data.gameType]
    		_ui_msg.data = msg_data
        	cc.Client.UIManager.openUI(_ui_msg)
    	} else {
            cc.log("其他人进入房间")
    		window.gFightMgr.playerEnter(msg_data)
    	}
    },

    onDestroy:function(){
        this._super()
        cc.Client.MessageManager.off(this)
    },

})
