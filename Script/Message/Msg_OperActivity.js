//********************************************************************************
//  generate: protoForJsTableTool
//  version: v1.0.1
//  author: UndaKunteera
//********************************************************************************

cc.Class({
    extends: cc.Component,
    init : function(){
        cc.GameMsg.MSG_TYPE[ 139201 ] = "OperActivity.ReqReward" // 请求领取奖励
        cc.GameMsg.MSG_TYPE[ 139101 ] = "OperActivity.ResActivityInfo" // 初始化消息
        cc.GameMsg.MSG_TYPE[ 139102 ] = "OperActivity.ResReward" // 领取奖励结果
        cc.GameMsg.MSG_TYPE[ 139103 ] = "OperActivity.ResNewActivity" // 有新活动开启
        cc.GameMsg.MSG_TYPE[ 139104 ] = "OperActivity.ResHaveRewardCanGet" // 有奖励可以领取

        cc.GameMsg.MSGID.CS_OPERACTIVITY_REQREWARD = 139201 // 请求领取奖励
        cc.GameMsg.MSGID.SC_OPERACTIVITY_RESACTIVITYINFO = 139101 // 初始化消息
        cc.GameMsg.MSGID.SC_OPERACTIVITY_RESREWARD = 139102 // 领取奖励结果
        cc.GameMsg.MSGID.SC_OPERACTIVITY_RESNEWACTIVITY = 139103 // 有新活动开启
        cc.GameMsg.MSGID.SC_OPERACTIVITY_RESHAVEREWARDCANGET = 139104 // 有奖励可以领取

        cc.log('网络消息编号注册完毕！模块：OperActivity')
    }
})