/*******************************************************************************
Copyright (C), 2016, RaTo Tech. Co., Ltd.
文 件 名: GameWebsocket.js
作    者: 刘伏波
创建日期: 2016-10-13
完成日期: 
功能描述: 网络模块
其它相关: 
修改记录: 
*******************************************************************************/

// 日志文件名
var LOG_FILE_NAME = 'GameWebsocket.js.log'

var director       = cc.director
var BaseManager    = require("BaseManager")

var CONNECT_TIME_OUT = 16   // 接超时时间
var CONNECT_TIMES    = 4    // 每小段时间内的连接次数限制

var WebSocketState = {
    Open : 1,
    Close : 2,
}

var GameWebsocket = cc.Class({
    extends: BaseManager,
    properties: {
        _websocket: null ,
        _wsReConnectTimes: 0 ,
        _reConnectMax: 3 ,
        _connectTimeout: 5 ,
        _reConnectFlag: false ,
        _msg: null ,
        _msgKey: null ,
        _msgSendStatus: 'nothing' ,
        _msgTimeout: 5 ,
        _msgTimeoutTimes: 0 ,
        _msgGet: '' ,
        _target: null ,
        _callback: null ,
        _hosts: '',
        readyState: 0,
        bReconnect : false,
    },


    init: function(host) {
        this.connect(host)    
        // 连接超时判断
        cc.director.getScheduler().schedule (this.connectTimeoutCheck, this, 0, 0, CONNECT_TIME_OUT)
    },
    
    // 打开连接
    connect: function (host, connect_callback) {
        if(connect_callback){
            this.m_connect_callback = connect_callback
        }
        this._hosts = host || this._hosts
        if (this._websocket){
            this._websocket.close()
            this._websocket = null
            cc.error('WebSocket null!!!')
        }

        this._websocket = null
        if(this._hosts == null){
            cc.error('sever host null')
            return
        }

        cc.log("正在连接的服务器的地址:", this._hosts)
        this._websocket = new WebSocket(this._hosts)
        if(!this._websocket){
            cc.error("创建WebSocket失败")
            return
        }
        var self = this
        this._websocket.onopen = function (evt) {
            var dumpContent = cc.Client.Utility.dump(evt, "websocket[onopen]")
            cc.log(dumpContent)
            self.onConnented(evt)
        };

        this._websocket.onmessage = function (evt) {
            self.onMessageRecv(evt)
        }

        this._websocket.onerror = function (evt) {
            var dumpContent = cc.Client.Utility.dump(evt, "websocket[onerror]")
            cc.log(dumpContent)
            self.onConnectError(evt)
        }

        this._websocket.onclose = function (evt) {
            var dumpContent = cc.Client.Utility.dump(evt, "websocket[onclose]")
            cc.log(dumpContent)
            self.onConnectClose(evt)

        }
    },

    // 连接超时判断
    connectTimeoutCheck: function (){

        if (this._websocket && this.readyState == WebSocketState.Close) {

            // 重连次数
            if (this._wsReConnectTimes > CONNECT_TIMES) {
                // 重试过多后，应该提示玩家目前网络不稳定
                cc.Client.UIHelper.UICenterNotice("网络不稳定，请稍后连接。")
            } else {
                this._wsReConnectTimes++
                cc.log("连接网络超时，当前连接次数:", this._wsReConnectTimes)
            }
        } else {
            this.connectTimeoutHandle()
        }
    },

    // 超时后 重新连接
    connectTimeoutHandle: function () {
        // 重新打开连接
        this.closeConnect()
    },

    // 关闭连接
    closeConnect: function () {
        this.onConnectClose()
        if (this._websocket && this.readyState == WebSocketState.Close) {
            this._websocket.close()
        }
    },

    // 连接后处理
    onConnented: function (evt) {
        cc.log("websocket connent success")
        cc.Client.UIHelper.UICenterNotice("连接服务器成功。")
        var msg = {
            name : "UINetConnect",
        }
        cc.Client.UIManager.closeUI(msg)
        this.readyState = WebSocketState.Open
        if(this.m_connect_callback){
            this.m_connect_callback()
        }

        // 获得连接的消息后，去掉超时判断
        cc.director.getScheduler().unscheduleCallbackForTarget(this , this.connectTimeoutCheck)

        // 清除重连次数
        this._wsReConnectTimes = 0

        // 是否有未发送的消息
        // TODO:

        // 检测是否自动登录 
        // TODO:

    },

    // 获得消息
    onMessageRecv: function (evt) {
        cc.log("recv message:", evt.data)
        cc.Client.MessageManager.netMessageProcess(evt.data)
    },

    // 获取错误
    onConnectError: function (evt) {
        this.closeConnect()
    },

    // 连接关闭处理
    onConnectClose: function (evt) {
        this._websocket = null
        var msg = {
            update : true,
            name : "UINetConnect",
            bReconnectAgain : true,
        }
        cc.Client.UIManager.openUI(msg)
    },

    // 给服务器发送消息
    sendToServer: function (msgId, message){ 
        
        var dataBuffer = message.encode().toBuffer()
        // 组装RPC数据
        var sendBuffer = cc.Client.MessageManager.packageMessage(msgId, dataBuffer)

        // 判断当前连接
        if (this.isOpen()) {
            this._websocket.send(sendBuffer)
        } else {
            cc.Client.UIHelper.UICenterNotice("网络未连接, 请连接网络后再试。")

            // 将未发送的消息缓存起来
            // TODO:
        }
    },

    // 准备消息
    beforeRequestSend: function (act, params, callback, target) {
        // 弹出 loading
        cc.log("process send msg")
    },

    // 消息被服务器响应了
    requestResponse: function (resObj) {

        // 获得响应的消息后，去掉 loading 遮罩
        cc.director.getScheduler().unscheduleCallbackForTarget( this , this.sendTimeoutCheck)
        this._msg = null
        this._msgSendStatus = 'nothing'
        this._callback.call(this._target, resObj._body)
    },

    // 发送消息超时判断
    sendTimeoutCheck: function (){
        if ( this._msgSendStatus == 'msgSend' ) {
            // 消息没有被响应，去掉 loading 遮罩
        }
    },

    // 超时后
    sendTimeoutHandle: function (){
        cc.log("net timeout")
    },

    // 超时消息处理
    callbackTimeoutHandle: function (resObj) {
        cc.log("net timeout handle")
    },

    // 判断ws是否已经连接
    isOpen: function () {
      return (this._websocket && this.readyState == WebSocketState.Open);
    },
})