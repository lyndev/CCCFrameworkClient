//********************************************************************************
//  generate: protoForJsTableTool
//  version: v1.0.1
//  author: UndaKunteera
//********************************************************************************

cc.Class({
    extends: cc.Component,
    init : function(){
        cc.GameMsg.MSG_TYPE[ 117201 ] = "SignIn.ReqSignIn" // 请求签到
        cc.GameMsg.MSG_TYPE[ 117202 ] = "SignIn.ReqExtraGet" // 请求补领
        cc.GameMsg.MSG_TYPE[ 117101 ] = "SignIn.ResSignInInfo" // 初始化玩家签到信息
        cc.GameMsg.MSG_TYPE[ 117102 ] = "SignIn.ResSignInResult" // 返回签到结果
        cc.GameMsg.MSG_TYPE[ 117103 ] = "SignIn.ResResExtraGet" // 返回补领结果

        cc.GameMsg.MSGID.CS_SIGNIN_REQSIGNIN = 117201 // 请求签到
        cc.GameMsg.MSGID.CS_SIGNIN_REQEXTRAGET = 117202 // 请求补领
        cc.GameMsg.MSGID.SC_SIGNIN_RESSIGNININFO = 117101 // 初始化玩家签到信息
        cc.GameMsg.MSGID.SC_SIGNIN_RESSIGNINRESULT = 117102 // 返回签到结果
        cc.GameMsg.MSGID.SC_SIGNIN_RESRESEXTRAGET = 117103 // 返回补领结果

        cc.log('网络消息编号注册完毕！模块：SignIn')
    }
})