//********************************************************************************
//  generate: protoForJsTableTool
//  version: v1.0.1
//  author: UndaKunteera
//********************************************************************************

cc.Class({
    extends: cc.Component,
    init : function(){
        cc.GameMsg.MSG_TYPE[ 122201 ] = "Rank.ReqBattlefieldRankList" // 客户端请求指定星级的战场（仙府）排行榜
        cc.GameMsg.MSG_TYPE[ 122101 ] = "Rank.ResBattlefieldRankList" // 服务端返回指定星级的战场（仙府）排行榜

        cc.GameMsg.MSGID.CS_RANK_REQBATTLEFIELDRANKLIST = 122201 // 客户端请求指定星级的战场（仙府）排行榜
        cc.GameMsg.MSGID.SC_RANK_RESBATTLEFIELDRANKLIST = 122101 // 服务端返回指定星级的战场（仙府）排行榜

        cc.log('网络消息编号注册完毕！模块：Rank')
    }
})