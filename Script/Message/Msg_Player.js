//********************************************************************************
//  generate: protoForJsTableTool
//  version: v1.0.1
//  author: UndaKunteera
//********************************************************************************

cc.Class({
    extends: cc.Component,
    init : function(){
        cc.GameMsg.MSG_TYPE[ 103202 ] = "Player.ReqGMCommand" // 临时命令消息
        cc.GameMsg.MSG_TYPE[ 103201 ] = "Player.ReqTimestamp" // 客户端请求时间戳
        cc.GameMsg.MSG_TYPE[ 103101 ] = "Player.ResTimestamp" // 服务器返回请求时间戳

        cc.GameMsg.MSGID.CS_PLAYER_REQGMCOMMAND = 103202 // 临时命令消息
        cc.GameMsg.MSGID.CS_PLAYER_REQTIMESTAMP = 103201 // 客户端请求时间戳
        cc.GameMsg.MSGID.SC_PLAYER_RESTIMESTAMP = 103101 // 服务器返回请求时间戳

        cc.log('网络消息编号注册完毕！模块：Player')
    }
})