//********************************************************************************
//  generate: protoForJsTableTool
//  version: v1.0.1
//  author: UndaKunteera
//********************************************************************************

cc.Class({
    extends: cc.Component,
    init : function(){
        cc.GameMsg.MSG_TYPE[ 151210 ] = "Room.ReqMoveKeyData" // 
        cc.GameMsg.MSG_TYPE[ 151211 ] = "Room.ReqLogicKeyData" // 
        cc.GameMsg.MSG_TYPE[ 151110 ] = "Room.ResMoveKeyDatas" // 
        cc.GameMsg.MSG_TYPE[ 151111 ] = "Room.ResLogicKeyDatas" // 
        cc.GameMsg.MSG_TYPE[ 151212 ] = "Room.ReqUDPEnterRoom" // 
        cc.GameMsg.MSG_TYPE[ 150201 ] = "Room.ReqCreateRoom" // 
        cc.GameMsg.MSG_TYPE[ 150202 ] = "Room.ReqEnterRoom" // 
        cc.GameMsg.MSG_TYPE[ 150203 ] = "Room.ReqLeaveRoom" // 
        cc.GameMsg.MSG_TYPE[ 150204 ] = "Room.ReqAction" // 
        cc.GameMsg.MSG_TYPE[ 150101 ] = "Room.ResEnterRoom" // 
        cc.GameMsg.MSG_TYPE[ 150102 ] = "Room.ResLeaveRoom" // 
        cc.GameMsg.MSG_TYPE[ 150103 ] = "Room.ResAction" // 
        cc.GameMsg.MSG_TYPE[ 150104 ] = "Room.ResWillExcuteAction" // 
        cc.GameMsg.MSG_TYPE[ 150105 ] = "Room.ResFightResult" // 
        cc.GameMsg.MSG_TYPE[ 150106 ] = "Room.ResGameStartFightData" // 

        cc.GameMsg.MSGID.CS_ROOM_REQMOVEKEYDATA = 151210 // 
        cc.GameMsg.MSGID.CS_ROOM_REQLOGICKEYDATA = 151211 // 
        cc.GameMsg.MSGID.SC_ROOM_RESMOVEKEYDATAS = 151110 // 
        cc.GameMsg.MSGID.SC_ROOM_RESLOGICKEYDATAS = 151111 // 
        cc.GameMsg.MSGID.CS_ROOM_REQUDPENTERROOM = 151212 // 
        cc.GameMsg.MSGID.CS_ROOM_REQCREATEROOM = 150201 // 
        cc.GameMsg.MSGID.CS_ROOM_REQENTERROOM = 150202 // 
        cc.GameMsg.MSGID.CS_ROOM_REQLEAVEROOM = 150203 // 
        cc.GameMsg.MSGID.CS_ROOM_REQACTION = 150204 // 
        cc.GameMsg.MSGID.SC_ROOM_RESENTERROOM = 150101 // 
        cc.GameMsg.MSGID.SC_ROOM_RESLEAVEROOM = 150102 // 
        cc.GameMsg.MSGID.SC_ROOM_RESACTION = 150103 // 
        cc.GameMsg.MSGID.SC_ROOM_RESWILLEXCUTEACTION = 150104 // 
        cc.GameMsg.MSGID.SC_ROOM_RESFIGHTRESULT = 150105 // 
        cc.GameMsg.MSGID.SC_ROOM_RESGAMESTARTFIGHTDATA = 150106 // 

        cc.log('网络消息编号注册完毕！模块：Room')
    }
})