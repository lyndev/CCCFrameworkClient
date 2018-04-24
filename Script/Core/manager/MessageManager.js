/*******************************************************************************
Copyright (C), 2016, XXX Tech. Co., Ltd.
文 件 名: MessageManager.js
作    者: lyn
创建日期: 2016-10-13
完成日期: 
功能描述: 
其它相关: 
修改记录: 
*******************************************************************************/

// 日志文件名
var LOG_FILE_NAME = 'MessageManager.js.log'

var Utility             = require("Utility")
var GameType            = require("GameType")
var BaseManager         = require("BaseManager")
var LocaMessageIdConfig = require("LocaMessageIdConfig")

var MessageManager = cc.Class({
    extends: BaseManager,
    msgRegisterMap : null,

    ctor: function() {
        this.msgRegisterMap = {}
        this.MSGID          = cc.GameMsg.MSGID
        this.BUILDER        = cc.GameMsg.Builder
        this.MSG_TYPE       = cc.GameMsg.MSG_TYPE
    },
  	
    init: function (msg) {
        var _locaMessageIdConfig = new LocaMessageIdConfig()
        _locaMessageIdConfig.init()
    },

    // 根据对象消息id注册销毁RPC回调
    register: function(obj, msgId, callback) {
        var objKey = obj.__instanceId
        if (!this.msgRegisterMap[msgId]) {
            this.msgRegisterMap[msgId] = {}
        } 

        var _msgIdRegisters = this.msgRegisterMap[msgId]
        if (!_msgIdRegisters[objKey]) {
            _msgIdRegisters[objKey] = {}
        }

        _msgIdRegisters[objKey][callback] = callback
        cc.log("register callback ", msgId )
    },

    // 消息分发器
    msgDispatcher: function(msgId, msgData) {
        if(msgId && msgData){
            var _objRegisters = this.msgRegisterMap[msgId]
            if (_objRegisters) {
                for(var objKeys in _objRegisters){
                    var callbacks = _objRegisters[objKeys]
                    for(var func in callbacks){
                        callbacks[func](msgId, msgData)
                    }
                }
            } else {
                cc.info("the msgId:%d, not have register callback", msgId)
            }
        } else {
            cc.error("ths msg msgDispatcher dispatch fial, ths msgId or msg data ni null")
        }
    },

    // 移除对象的对应的msgId的Callback
    offTarget: function(obj, msgId) {
        var objKey = obj.__instanceId
        var _msgIdRegisters = this.msgRegisterMap[msgId]
        if (_msgIdRegisters) {
            if (_msgIdRegisters[objKey]) {
                _msgIdRegisters[objKey] = null
                delete _msgIdRegisters[objKey]
            } else {
               cc.error("not find objkey callback", objKey)
            }  
        } else {
            cc.error("not the msgId:%s callback", msgId)
        }
    },

    // 移除对象所有的msgId的Callback
    off: function(obj) {
        var objKey = obj.__instanceId
        for(var _key in this.msgRegisterMap){
            var _objCallbacks = this.msgRegisterMap[_key]
            if (_objCallbacks[objKey]) {
                _objCallbacks[objKey] = null
                delete _objCallbacks[objKey]
                cc.log("移除了消息注册对象:", obj.__classname__, obj.__instanceId)
            }   
        }
    },

    // 发送消息
    packageMessage: function(msgId, sendBuffer){
        // 组装用户数据到RPC数据
        var MessageRpcData = cc.GameMsg.Builder.build("BaseMessage.RpcData")
        var rpcData = new MessageRpcData()
        rpcData.set("msgId", msgId)
        rpcData.set("serialized_msgData", sendBuffer)

        // 组装RPC
        var MessageRpc = cc.GameMsg.Builder.build("BaseMessage.Rpc")
        var rpc = new MessageRpc()
        rpc.set("rpcData", rpcData)

        var packageDataBuff = rpc.encode().toBuffer()

        var decodeSendBuffer = cc.GameMsg.Builder.build(cc.GameMsg.MSG_TYPE[msgId]) 
        var decodeSendBufferData = decodeSendBuffer.decode(sendBuffer)
        if(msgId && msgId != 100210){
            cc.Client.Utility.dumpMsg(msgId, this.MSG_TYPE[msgId], decodeSendBufferData, GameType.MsgActionType.Send)
        }

        return packageDataBuff
    },

    netMessageProcess: function(msgData){
        var parseData = this.parseMessageRPC(msgData)
        var msgId = parseData[0]
        var msgData = parseData[1]

        if(!this.MSG_TYPE[msgId]){
            cc.error( msgId + " 没有定义proto的结构无法解析 " + this.MSG_TYPE[msgId])
            return
        }

        var msgDataMessage = cc.GameMsg.Builder.build(this.MSG_TYPE[msgId])
        var recvData = msgDataMessage.decode(msgData)
        
        // 打印消息日志
        cc.Client.Utility.dumpMsg(msgId, this.MSG_TYPE[msgId], recvData, GameType.MsgActionType.Recv) 

        // 分发接收数据
        this.msgDispatcher(msgId, recvData)

    },

    localMessageProcess: function(msgId, msgData){
        // 分发接收数据
        this.msgDispatcher(msgId, msgData)   
    },

    // 解析消息RPC数据
    parseMessageRPC: function(recvData){
        // 数据解码rpcData
        var decodeRpcMessage = cc.GameMsg.Builder.build("BaseMessage.Rpc")
        var msgRpc = decodeRpcMessage.decode(recvData)
        var rpcData = msgRpc.get("rpcData")

        // 获取msgId, serialized_msgData
        var msgId = rpcData.get("msgId")  
        var serialized_msgData = rpcData.get("serialized_msgData")
        return [msgId, serialized_msgData]
    },

    // 发送本地消息
    sendLocalMsg: function(msgId, msgData) {
        // 分发接收数据
        this.localMessageProcess(msgId, msgData) 
    },

    // 功能编号
	msgFunction: function (msgId) {
	    return Math.floor(msgId / 1000)
	},

	// 消息来源
	msgScource: function (msgId) {
    	return Math.floor(msgId / 100) % 10
	},

    // 重置注册列表
    resetRegisterList: function() {
        this.msgRegisterMap = {}
    },
})