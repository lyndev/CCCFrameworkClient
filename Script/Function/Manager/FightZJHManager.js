/*******************************************************************************
Copyright (C), 2015-2019, RaTo Tech. Co., Ltd.
文 件 名: FightZJHManager.js
作    者: 刘伏波
创建日期: 2018-04-04
完成日期: 
功能描述: 
其它相关: 
修改记录: 
*******************************************************************************/

// 日志文件名
var LOG_FILE_NAME = 'FightZJHManager.js.log'

var BaseManager = require("BaseManager")

var PLAYER_COUNT = 7
var FightZJHManager = cc.Class({
    extends: BaseManager,

    ctor:function(){
    	this.m_players = {}
    	this.m_playerReadState = []
    	this.m_playerLocation = []
    	for (var i = 0; i < PLAYER_COUNT; i++) {
    		this.m_playerLocation.push("")
    		this.m_playerReadState.push(false)
    	}
    },

    init:function(msg){
        var self = this
        cc.Client.MessageManager.register(this, cc.GameMsg.MSGID.SC_ROOM_RESLEAVEROOM, function(msg_id, msg_data){
            var _role_id = msg_data.playerId
            var _location = self.getPlayerIndex(_role_id)
            self.playerLeave(_location)
        })
    },

    setPlayerInfo:function(playerInfo){
    	this.m_players[playerInfo.roleId] = playerInfo
    },

    playerLeave:function(location_index){
        globalEvent.emit("player_leave", {location : location_index})
    	this.m_playerReadState[location_index] = false 
		this.m_playerLocation[location_index] = ""
    },

    playerEnter:function(msg){
    	this.setPlayerInfo(msg.playerBaseInfo) 
    	this.m_playerLocation[msg.locationIndex] = msg.playerBaseInfo.roleId
    	this.m_playerReadState[msg.locationIndex] = msg.bReady
    	var _my_role_id = cc.Client.PlayerManager.getRoleId()
    	if(_my_role_id == msg.playerBaseInfo.roleId){
    		this.setRoomInfo(msg.roomInfo)
    	}
    	globalEvent.emit("player_enter", {location : msg.locationIndex})
    },

    setRoomInfo:function(room_info){
    	this.roomInfo = room_info
    },

	getRoomInfo:function(){
    	return this.roomInfo
    },

    isReady:function(location){
      return this.m_playerReadState[location]  
    },

    setReady:function(location, bReady){
      this.m_playerReadState[location]  = bReady
    },

    getPlayerInfoByLocation:function(location_index){
    	var _role_id = this.m_playerLocation[location_index]
    	return this.getPlayerInfoByRoleId(_role_id)
    },

    getPlayerInfoByRoleId:function(role_id){
    	if(role_id && role_id != ""){
    		return this.m_players[role_id]
    	}
    },

    getPlayerRoleId:function(location){
        return this.m_playerLocation[location]
    },

    getPlayerIndex:function(role_id){
        for (var i = 0; i < PLAYER_COUNT; i++) {
            if(this.m_playerLocation[i] == role_id){
                return i
            }
        }
    },

    getPlayerLocations:function(){
        return this.m_playerLocation
    },

    onDestroy:function(){
        this._super()
        cc.Client.MessageManager.off(this)
    }
})