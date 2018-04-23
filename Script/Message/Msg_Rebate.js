//********************************************************************************
//  generate: protoForJsTableTool
//  version: v1.0.1
//  author: UndaKunteera
//********************************************************************************

cc.Class({
    extends: cc.Component,
    init : function(){
        cc.GameMsg.MSG_TYPE[ 129201 ] = "Rebate.ReqGetReward" // 客户端请求领取奖励
        cc.GameMsg.MSG_TYPE[ 129202 ] = "Rebate.ReqRebateInfo" // 请求全部活动信息
        cc.GameMsg.MSG_TYPE[ 129101 ] = "Rebate.ResRebateInfo" // 全部活动信息
        cc.GameMsg.MSG_TYPE[ 129102 ] = "Rebate.ResError" // 错误码消息
        cc.GameMsg.MSG_TYPE[ 129103 ] = "Rebate.ResGetReward" // 

        cc.GameMsg.MSGID.CS_REBATE_REQGETREWARD = 129201 // 客户端请求领取奖励
        cc.GameMsg.MSGID.CS_REBATE_REQREBATEINFO = 129202 // 请求全部活动信息
        cc.GameMsg.MSGID.SC_REBATE_RESREBATEINFO = 129101 // 全部活动信息
        cc.GameMsg.MSGID.SC_REBATE_RESERROR = 129102 // 错误码消息
        cc.GameMsg.MSGID.SC_REBATE_RESGETREWARD = 129103 // 

        cc.log('网络消息编号注册完毕！模块：Rebate')
    }
})