//********************************************************************************
//  generate: protoForJsTableTool
//  version: v1.0.1
//  author: UndaKunteera
//********************************************************************************

cc.Class({
    extends: cc.Component,
    init : function(){
        cc.GameMsg.MSG_TYPE[ 118101 ] = "Notify.ResNotifyPlayer" // 提示消息
        cc.GameMsg.MSG_TYPE[ 118102 ] = "Notify.ResNotify" // 走马灯公告

        cc.GameMsg.MSGID.SC_NOTIFY_RESNOTIFYPLAYER = 118101 // 提示消息
        cc.GameMsg.MSGID.SC_NOTIFY_RESNOTIFY = 118102 // 走马灯公告

        cc.log('网络消息编号注册完毕！模块：Notify')
    }
})