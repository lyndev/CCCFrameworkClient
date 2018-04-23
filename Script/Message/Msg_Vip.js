//********************************************************************************
//  generate: protoForJsTableTool
//  version: v1.0.1
//  author: UndaKunteera
//********************************************************************************

cc.Class({
    extends: cc.Component,
    init : function(){
        cc.GameMsg.MSG_TYPE[ 128202 ] = "Vip.ReqGetRewards" // 领取奖励
        cc.GameMsg.MSG_TYPE[ 128100 ] = "Vip.ResVipLevel" // 等级变化消息
        cc.GameMsg.MSG_TYPE[ 128101 ] = "Vip.ResVipRewardsInfo" // 奖励状态
        cc.GameMsg.MSG_TYPE[ 128102 ] = "Vip.ResGetRewards" // 请求领奖结果

        cc.GameMsg.MSGID.CS_VIP_REQGETREWARDS = 128202 // 领取奖励
        cc.GameMsg.MSGID.SC_VIP_RESVIPLEVEL = 128100 // 等级变化消息
        cc.GameMsg.MSGID.SC_VIP_RESVIPREWARDSINFO = 128101 // 奖励状态
        cc.GameMsg.MSGID.SC_VIP_RESGETREWARDS = 128102 // 请求领奖结果

        cc.log('网络消息编号注册完毕！模块：Vip')
    }
})