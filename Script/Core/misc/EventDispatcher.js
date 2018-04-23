/*******************************************************************************
Copyright (C), 2016, RaTo Tech. Co., Ltd.
文 件 名: EventDispatcher.js
作    者: 何伟
创建日期: 2017-4-13
完成日期: 
功能描述: 
其它相关: 
修改记录: 
*******************************************************************************/

// 使用方法：
// 注册 EventDispatcher.getInstance().on("test", this, this.test)

// 发送事件
// var event = {}
// event.name = "test"
// event.str = "aaaaaaaaaaa"
// EventDispatcher.getInstance().emit(event)


// 日志文件名
var LOG_FILE_NAME = 'EventDispatcher.js.log'

var EventDispatcher = cc.Class({
    extends: cc.Component,

    ctor: function(){
        this.m_callBackMap = {}
    },

    // 注册回调事件 strType, pCallobj, callBackFun
    on:function(strType, pCallobj, callBackFun){
        if(typeof(strType)!= "string" || typeof(pCallobj) != "object" || typeof(callBackFun) != "function"){
            cc.log("AddEventListener param error:strType=%s,obj=%s,func=%s", strType, typeof(pCallobj), typeof(callBackFun))
            return false
        }
        this.m_callBackMap[strType] = this.m_callBackMap[strType] || []

        var objcallBack = {}
        objcallBack.pCallobj = pCallobj
        objcallBack.callBackFun = callBackFun
        this.m_callBackMap[strType].push(objcallBack)
        return true
    },

    //从EventDispatcher 对象中删除侦听器
    removeByType:function(strType, pCallobj){
        if(typeof(strType)!= "string" || typeof(pCallobj) != "object"){
            cc.log("removeByType param error:%s,%s", strType, typeof(pCallobj))
            return
        }
        var callList = this.m_callBackMap[strType]
        if(callList == null){
            return
        }
        for(var i = 0; i < callList.length; i++){
            if(callList[i].pCallobj == pCallobj){
                callList[i] = null
                delete callList[i]
            }
        }
    },

    //功能: 将对象pCallobj注册的所有监听事件从 EventDispatcher 对象中删除侦听器
    removeByObj:function(pCallobj){
        if(typeof(pCallobj) != "object"){
            cc.log("RemoveEventListenerObj param error:%s", typeof(pCallobj))
            return
        }
        for(var callList in self.m_callBackMap){
            this.removeByType(callList, pCallobj)
        }
    },

    //功能: 将其所有监听都干掉
    removeAll: function(){
        this.m_callBackMap = {}
    },

    //功能: 分派事件
    emit:function(eve){
        var callList = this.m_callBackMap[eve.name]
        if(callList == null){
            return
        }
        for(var i = 0; i < callList.length; i++){
            var val = callList[i]
            if(val.callBackFun == null){
                cc.log("val.callBackFun is nil")
            }else{
                if(typeof(val.callBackFun) == "function"){
                    val.callBackFun(eve)
                }else{
                    cc.log("val.callBackFun error:%s", typeof(val.callBackFun))
                }
            }
        }
    },
})

// 消息管理器单例
EventDispatcher._instance = null
EventDispatcher.getInstance = function () {
    if (!this._instance) {
        this._instance = new EventDispatcher()
    }
    return this._instance
}