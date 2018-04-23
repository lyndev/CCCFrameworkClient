//********************************************************************************
//  generate: protoForJsTableTool
//  version: v1.0.1
//  author: UndaKunteera
//********************************************************************************

cc.Class({
    extends: cc.Component,
    init : function(){
        cc.GameMsg.MSG_TYPE[ 115101 ] = "NewFeature.ResFeatureInfo" // 服务器发送功能状态
        cc.GameMsg.MSG_TYPE[ 115102 ] = "NewFeature.ResUpdateFeature" // 服务器发送功能更新

        cc.GameMsg.MSGID.SC_NEWFEATURE_RESFEATUREINFO = 115101 // 服务器发送功能状态
        cc.GameMsg.MSGID.SC_NEWFEATURE_RESUPDATEFEATURE = 115102 // 服务器发送功能更新

        cc.log('网络消息编号注册完毕！模块：NewFeature')
    }
})