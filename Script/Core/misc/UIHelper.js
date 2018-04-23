/*******************************************************************************
Copyright (C), 2016, RaTo Tech. Co., Ltd.
文 件 名: cc.Client.UIHelper.js
作    者: 刘伏波
创建日期: 2016-10-17
完成日期: 
功能描述: 游戏ui的帮助脚本
其它相关: 
修改记录: 
*******************************************************************************/

// 日志文件名
var LOG_FILE_NAME = 'cc.Client.UIHelper.js.log'

var NoticeManager = require("NoticeManager")

// 注: 这里不把var UIManager = require("UIManager") 放在这里的原因是UIManager 引用了UIHelper,出现了循环引用
cc.Class({
    extends: cc.Component,

    // 屏幕中心提示
    UICenterNotice : function(contentText) {
        cc.Client.NoticeManager.onAddNotice(contentText)
    },

    UICenterMaskNotice : function(contentText){
        if (contentText) {
            cc.log("[UICenterMaskNotice] center mask notice :%s", contentText)    
            var msg = {
                content : contentText,
                name : "UICenterMaskNotice",
            }
            var UIManager = require("UIManager")
            cc.Client.UIManager.openUI(msg)
        }
    },

    CloseUICenterMaskNotice : function(){
        var msg = {
            name : "UICenterMaskNotice",
        }
        var UIManager = require("UIManager")
        cc.Client.UIManager.closeUI(msg)  
    },

    // 用法: cc.Client.UIHelper.AddClickEvent(this.testBtn, this.node, "BtnFunctionTest", this.__classname__)
    AddClickEvent : function(node, target, handler, component){
        if(!component){
            log.error("<unknown component>")
            return
        }
        var eventHandler = new cc.Component.EventHandler()
        eventHandler.target = target
        eventHandler.component = component
        eventHandler.handler = handler

        var clickEvents = node.getComponent(cc.Button).clickEvents;
        clickEvents.push(eventHandler)
    },
        
    AddSlideEvent :function(node, target, handler, component){
        if(!component){
            log.error("<unknown component>")
            reutrn
        }

        var eventHandler = new cc.Component.EventHandler()
        eventHandler.target = target
        eventHandler.component = component
        eventHandler.handler = handler

        var slideEvents = node.getComponent(cc.Slider).slideEvents
        slideEvents.push(eventHandler)
    },

    AddEscEvent : function(node){
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed:  function(keyCode, event){
            },

            onKeyReleased: function(keyCode, event){
                if(keyCode == cc.KEY.back){
                    cc.log("点击了esc, 退出游戏？")
          /*          cc.vv.alert.show('提示','确定要退出游戏吗？',function(){
                        cc.game.end();
                    },true);*/
                }
            }
        }, node)
    },

    DestroyChildren : function(nodeParent){
        var _children = nodeParent.children
        if (_children) {
            for (var i = 0, len = _children.length; i < len; i++){
                var node = _children[i]
                if(node){
                    node.destroy()
                }
            }
        }
    },

    FindNodeByName : function(nodeParent, name){
        var _name = name+""

        if(!nodeParent){
            cc.error("nodeParent is null")
            return
        }
        
        if(nodeParent.name == _name){
            return nodeParent
        }
        
        var _children = nodeParent.children
        if (_children) {
            for (var i = 0, len = _children.length; i < len; i++){
                var node = _children[i]
                var _findNode = this.FindNodeByName(node, _name)
                if (_findNode) {
                    return _findNode
                }
            }
        } else {
            cc.error("the node children is null")
        }

        return null
    },

    GrayNode:function(node){
        if(node != null){
            if(node.getComponent(cc.Sprite)){
                node.color = new cc.Color(125, 125, 125, 255)
            }
            var _children = node.children
            if (_children) {
                for (var i = 0, len = _children.length; i < len; i++){
                    var _node = _children[i]
                    this.GrayNode(_node)
                }
            }    
        } else {
            cc.log("node is null")
        }

    },

    ResetGrayNode:function(node){
        if(node != null){
            if(node.getComponent(cc.Sprite)){
                node.color = new cc.Color(255, 255, 255, 255)
            }
            var _children = node.children
            if (_children) {
                for (var i = 0, len = _children.length; i < len; i++){
                    var _node = _children[i]
                    this.ResetGrayNode(_node)
                }
            } 
        } else {
            cc.log("node is null")
        }
    },

});

/*module.exports = {
	UICenterNotice : UICenterNotice,
    FindNodeByName : FindNodeByName,
    UICenterMaskNotice : UICenterMaskNotice,
    CloseUICenterMaskNotice : CloseUICenterMaskNotice,
    AddClickEvent : AddClickEvent,
    AddSlideEvent : AddSlideEvent,
    AddEscEvent : AddEscEvent,
    DestroyChildren : DestroyChildren,
    GrayNode : GrayNode,
    ResetGrayNode : ResetGrayNode,
}*/