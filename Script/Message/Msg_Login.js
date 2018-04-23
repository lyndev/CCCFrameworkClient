//********************************************************************************
//  generate: protoForJsTableTool
//  version: v1.0.1
//  author: UndaKunteera
//********************************************************************************

cc.Class({
    extends: cc.Component,
    init : function(){
        cc.GameMsg.MSG_TYPE[ 100201 ] = "Login.ReqLogin" // 客户端请求登录消息
        cc.GameMsg.MSG_TYPE[ 100202 ] = "Login.ReqCreateRole" // 客户端请求创建角色
        cc.GameMsg.MSG_TYPE[ 100104 ] = "Login.ResCreateRoleFailed" // 创建角色失败
        cc.GameMsg.MSG_TYPE[ 100101 ] = "Login.ResLoginFailed" // 服务端回复登录失败
        cc.GameMsg.MSG_TYPE[ 100102 ] = "Login.ResLoginSuccess" // 服务端回复登录成功
        cc.GameMsg.MSG_TYPE[ 100203 ] = "Login.ReqReconnect" // 客户端请求重连消息
        cc.GameMsg.MSG_TYPE[ 100103 ] = "Login.ResReconnetFialed" // 服务端回复重连失败
        cc.GameMsg.MSG_TYPE[ 100104 ] = "Login.ResReconnetSuccess" // 服务端回复重连成功
        cc.GameMsg.MSG_TYPE[ 100105 ] = "Login.ResNotLogin" // 服务端回复玩家没有登录（或者会话过期）
        cc.GameMsg.MSG_TYPE[ 100106 ] = "Login.ResCloseSocket" // 
        cc.GameMsg.MSG_TYPE[ 100198 ] = "Login.ResPingPong" // 
        cc.GameMsg.MSG_TYPE[ 100199 ] = "Login.ResAck" // 

        cc.GameMsg.MSGID.CS_LOGIN_REQLOGIN = 100201 // 客户端请求登录消息
        cc.GameMsg.MSGID.CS_LOGIN_REQCREATEROLE = 100202 // 客户端请求创建角色
        cc.GameMsg.MSGID.SC_LOGIN_RESCREATEROLEFAILED = 100104 // 创建角色失败
        cc.GameMsg.MSGID.SC_LOGIN_RESLOGINFAILED = 100101 // 服务端回复登录失败
        cc.GameMsg.MSGID.SC_LOGIN_RESLOGINSUCCESS = 100102 // 服务端回复登录成功
        cc.GameMsg.MSGID.CS_LOGIN_REQRECONNECT = 100203 // 客户端请求重连消息
        cc.GameMsg.MSGID.SC_LOGIN_RESRECONNETFIALED = 100103 // 服务端回复重连失败
        cc.GameMsg.MSGID.SC_LOGIN_RESRECONNETSUCCESS = 100104 // 服务端回复重连成功
        cc.GameMsg.MSGID.SC_LOGIN_RESNOTLOGIN = 100105 // 服务端回复玩家没有登录（或者会话过期）
        cc.GameMsg.MSGID.SC_LOGIN_RESCLOSESOCKET = 100106 // 
        cc.GameMsg.MSGID.SC_LOGIN_RESPINGPONG = 100198 // 
        cc.GameMsg.MSGID.SC_LOGIN_RESACK = 100199 // 

        cc.log('网络消息编号注册完毕！模块：Login')
    }
})