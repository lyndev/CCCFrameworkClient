/*******************************************************************************
Copyright (C), 2015-2019, RaTo Tech. Co., Ltd.
文 件 名: UIEnterCustomRoom.js
作    者: 刘伏波
创建日期: 2018-03-28
完成日期: 
功能描述: 
其它相关: 
修改记录: 
*******************************************************************************/

// 日志文件名
var LOG_FILE_NAME = 'UIEnterCustomRoom.js.log'

var UIBase   = require("UIBase")
var ROOM_NUMBER_LEN = 5
cc.Class({
    extends: UIBase,
    properties: {
    	btnReturn:cc.Node,
        btnCreateRoom:cc.Node,
        btnJionRoom:cc.Node,
        btnDelOneNumber:cc.Node,
        btnReinputNumber:cc.Node,
        m_numbers:[],
        m_roomNumberNode:{default:[], type: cc.Label}
    }, 

    onLoad:function () {
    	cc.Client.UIStackManager.pushUI(this.__classname__, cc.Client.GameType.UIActionType.Hide)
    	cc.Client.UIHelper.AddClickEvent(this.btnReturn, this.node, "onReturnBtnClick", this.__classname__)
        cc.Client.UIHelper.AddClickEvent(this.btnCreateRoom, this.node, "onCreateRoomBtnClick", this.__classname__)
        cc.Client.UIHelper.AddClickEvent(this.btnJionRoom, this.node, "onJoinRoomBtnClick", this.__classname__)
        cc.Client.UIHelper.AddClickEvent(this.btnDelOneNumber, this.node, "delOneNumberClick", this.__classname__)
        cc.Client.UIHelper.AddClickEvent(this.btnReinputNumber, this.node, "reinputBtnClick", this.__classname__)
    },

    init:function(msg){

 	},

 	onReturnBtnClick:function(event){
        var msg = {}
        msg.name = "UIEnterCustomRoom"
        cc.Client.UIManager.closeUI(msg)
 	},

    onCreateRoomBtnClick:function(envet){
        var msg = cc.Client.MessageUtility.getMsgStruct(cc.GameMsg.MSGID.CS_ROOM_REQCREATEROOM)
        msg.roomType = cc.Client.GameType.RoomType.CUSTOM
        msg.gameType = cc.Client.GameType.GameType.ZJH
        cc.Client.GameWebsocket.sendToServer(cc.GameMsg.MSGID.CS_ROOM_REQCREATEROOM, msg)
    },

    onJoinRoomBtnClick:function(envet){
        cc.log("加入房间")
    },

    onClickNumber:function(event, customEventData){
        if(this.m_numbers.length < ROOM_NUMBER_LEN){
            this.m_roomNumberNode[this.m_numbers.length].string = customEventData
            this.m_numbers.push(Number(customEventData))
        }
        if(this.m_numbers.length == ROOM_NUMBER_LEN){
            var _room_number = this.m_numbers.join("")
            cc.log("发送房间号:", _room_number)
            var msg = cc.Client.MessageUtility.getMsgStruct(cc.GameMsg.MSGID.CS_ROOM_REQENTERROOM)
            msg.roomType = cc.Client.GameType.RoomType.CUSTOM
            msg.gameType = cc.Client.GameType.GameType.ZJH
            msg.roomNumber = Number(_room_number)
            cc.Client.GameWebsocket.sendToServer(cc.GameMsg.MSGID.CS_ROOM_REQENTERROOM, msg)
        }
    },

    reinputBtnClick:function(event){
        this.m_numbers = []
        for (var i = 0; i < ROOM_NUMBER_LEN; i++) {
            this.clearIndexNumber(i)       
        }
    },

    delOneNumberClick:function(event){
        var _curIndex = this.m_numbers.length - 1
        if(_curIndex < 0){
            _curIndex = 0
        }
        this.clearIndexNumber(_curIndex)
        this.m_numbers.pop()
    },

    clearIndexNumber:function(index){
        if(this.m_roomNumberNode[index]){
            this.m_roomNumberNode[index].string = ""
        }
    },

 	onDestroy:function(){
        this._super()
        cc.Client.UIStackManager.popUI(this.__classname__)
    },
})