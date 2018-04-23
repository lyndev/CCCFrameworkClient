//********************************************************************************
//  generate: protoForJsTableTool
//  version: v1.0.1
//  author: UndaKunteera
//********************************************************************************

cc.Class({
    extends: cc.Component,
    init : function(){
        cc.GameMsg.MSG_TYPE[ 113201 ] = "Mail.ReqMailList" // 
        cc.GameMsg.MSG_TYPE[ 113202 ] = "Mail.ReqGetAccessory" // 
        cc.GameMsg.MSG_TYPE[ 113203 ] = "Mail.ReqMailRead" // 
        cc.GameMsg.MSG_TYPE[ 113204 ] = "Mail.ReqMailDelete" // 
        cc.GameMsg.MSG_TYPE[ 113101 ] = "Mail.ResMailList" // 
        cc.GameMsg.MSG_TYPE[ 113102 ] = "Mail.ResMailDelete" // 

        cc.GameMsg.MSGID.CS_MAIL_REQMAILLIST = 113201 // 
        cc.GameMsg.MSGID.CS_MAIL_REQGETACCESSORY = 113202 // 
        cc.GameMsg.MSGID.CS_MAIL_REQMAILREAD = 113203 // 
        cc.GameMsg.MSGID.CS_MAIL_REQMAILDELETE = 113204 // 
        cc.GameMsg.MSGID.SC_MAIL_RESMAILLIST = 113101 // 
        cc.GameMsg.MSGID.SC_MAIL_RESMAILDELETE = 113102 // 

        cc.log('网络消息编号注册完毕！模块：Mail')
    }
})