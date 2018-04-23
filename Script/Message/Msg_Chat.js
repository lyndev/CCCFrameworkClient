//********************************************************************************
//  generate: protoForJsTableTool
//  version: v1.0.1
//  author: UndaKunteera
//********************************************************************************

cc.Class({
    extends: cc.Component,
    init : function(){
        cc.GameMsg.MSG_TYPE[ 131501 ] = "Chat.ReqSendTextMessage" // 发送文本信息
        cc.GameMsg.MSG_TYPE[ 131502 ] = "Chat.ReqSendAudioMessage" // 发送语音信息
        cc.GameMsg.MSG_TYPE[ 131503 ] = "Chat.ReqFetchAudioMessage" // 请求获取语音信息
        cc.GameMsg.MSG_TYPE[ 131601 ] = "Chat.ResSendTextMessage" // 返回发送文本消息
        cc.GameMsg.MSG_TYPE[ 131602 ] = "Chat.ResSendAudioMessage" // 返回发送语音消息
        cc.GameMsg.MSG_TYPE[ 131603 ] = "Chat.ResFetchAudioMessage" // 返回获取语音消息
        cc.GameMsg.MSG_TYPE[ 131604 ] = "Chat.NotifyTextMessage" // 
        cc.GameMsg.MSG_TYPE[ 131605 ] = "Chat.NotifyAudioMessage" // 
        cc.GameMsg.MSG_TYPE[ 131606 ] = "Chat.ResInitChatRecordMessag" // 初始化聊天记录消息
        cc.GameMsg.MSG_TYPE[ 131699 ] = "Chat.ResError" // 

        cc.GameMsg.MSGID._CHAT_REQSENDTEXTMESSAGE = 131501 // 发送文本信息
        cc.GameMsg.MSGID._CHAT_REQSENDAUDIOMESSAGE = 131502 // 发送语音信息
        cc.GameMsg.MSGID._CHAT_REQFETCHAUDIOMESSAGE = 131503 // 请求获取语音信息
        cc.GameMsg.MSGID._CHAT_RESSENDTEXTMESSAGE = 131601 // 返回发送文本消息
        cc.GameMsg.MSGID._CHAT_RESSENDAUDIOMESSAGE = 131602 // 返回发送语音消息
        cc.GameMsg.MSGID._CHAT_RESFETCHAUDIOMESSAGE = 131603 // 返回获取语音消息
        cc.GameMsg.MSGID._CHAT_NOTIFYTEXTMESSAGE = 131604 // 
        cc.GameMsg.MSGID._CHAT_NOTIFYAUDIOMESSAGE = 131605 // 
        cc.GameMsg.MSGID._CHAT_RESINITCHATRECORDMESSAG = 131606 // 初始化聊天记录消息
        cc.GameMsg.MSGID._CHAT_RESERROR = 131699 // 

        cc.log('网络消息编号注册完毕！模块：Chat')
    }
})