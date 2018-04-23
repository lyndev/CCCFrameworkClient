//********************************************************************************
//  generate: protoForJsTableTool
//  version: v1.0.1
//  author: UndaKunteera
//********************************************************************************

cc.Class({
    extends: cc.Component,
    init : function(){
        cc.GameMsg.MSG_TYPE[ 126201 ] = "Recharge.ReqRechargeVerify" // 客户端请求验证充值结果
        cc.GameMsg.MSG_TYPE[ 126202 ] = "Recharge.ReqGetFirstRechargeReward" // 客户端请求领取首充奖励
        cc.GameMsg.MSG_TYPE[ 126101 ] = "Recharge.ResVerifyResult" // 服务端返回充值验证结果
        cc.GameMsg.MSG_TYPE[ 126102 ] = "Recharge.ResRechargeInfo" // 服务器返回充值信息以及首充奖励信息
        cc.GameMsg.MSG_TYPE[ 126103 ] = "Recharge.ResGetFirstRewardResult" // 服务器返回领取首充奖励结果

        cc.GameMsg.MSGID.CS_RECHARGE_REQRECHARGEVERIFY = 126201 // 客户端请求验证充值结果
        cc.GameMsg.MSGID.CS_RECHARGE_REQGETFIRSTRECHARGEREWARD = 126202 // 客户端请求领取首充奖励
        cc.GameMsg.MSGID.SC_RECHARGE_RESVERIFYRESULT = 126101 // 服务端返回充值验证结果
        cc.GameMsg.MSGID.SC_RECHARGE_RESRECHARGEINFO = 126102 // 服务器返回充值信息以及首充奖励信息
        cc.GameMsg.MSGID.SC_RECHARGE_RESGETFIRSTREWARDRESULT = 126103 // 服务器返回领取首充奖励结果

        cc.log('网络消息编号注册完毕！模块：Recharge')
    }
})