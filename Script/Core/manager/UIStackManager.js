/*******************************************************************************
Copyright (C), 2016, XXX Tech. Co., Ltd.
文 件 名: UIStackManager.js
作    者: lyn
创建日期: 2016-12-21
完成日期: 
功能描述: 
其它相关: 
修改记录: 
*******************************************************************************/

var LOG_FILE_NAME = 'UIStackManager.js.log'

var GameType    = require("GameType")
var UIManager   = require("UIManager")
var BaseManager = require("BaseManager")

var UIStackManager = cc.Class({
    extends: BaseManager,

    init: function(msg){
    	this.m_uiStack = []
    },

    // 弹栈到指定ui
    popUITo: function(uiName){
    	for (var i =  this.m_uiStack.length - 1; i >= 0; i--) {
    		var topUIData = this.m_uiStack[i]
    		if(topUIData.name == uiName){
    			var msg = topUIData.args
    			msg.name = uiName 
    			cc.Client.UIManager.openUI(msg)
    			break
    		} else {
    			this.m_uiStack.pop()
    			var msg = {}
    			msg.name = topUIData.name
    			cc.Client.UIManager.closeUI(msg)
    		}
    	}
    },

    // 弹出栈顶ui
    popUI: function(uiName){
		var len = this.m_uiStack.length
    	if(len < 1) 
    		return

        var topUIData = this.m_uiStack[this.m_uiStack.length - 1]
        if(uiName == topUIData.name){
    	    var popUIData = this.m_uiStack.pop()
    	    var action = popUIData.action
            topUIData = this.m_uiStack[this.m_uiStack.length - 1]
			if(action == GameType.UIActionType.Close) {
		    	cc.Client.UIManager.openUI(topUIData)
			} else if(action == GameType.UIActionType.Hide) {
				cc.Client.UIManager.showUIByName(topUIData.name, true)
	 		}
	 	}
    },

    // 压栈一个ui
    pushUI: function(uiName, action, args){
    	var len = this.m_uiStack.length
    	if(len > 0) {
            var topUIData = this.m_uiStack[len - 1]
            if(topUIData.name == uiName)
                return

			if(action == GameType.UIActionType.Close) {
				var uiMsg = {}	
				uiMsg.name = topUIData.name
		    	cc.Client.UIManager.closeUI(uiMsg)
			} else if(action == GameType.UIActionType.Hide) {
				cc.Client.UIManager.showUIByName(topUIData.name, false)
	 		} else if(action == GameType.UIActionType.None) {

			} else {
				cc.error("UIActionType错误, 入栈UI操作类型仅能用Hide, Close, None")
				return
			}
		}
    	
    	var uiData = {}
    	uiData.name = uiName
    	uiData.action = action
    	uiData.args = args
    	this.m_uiStack.push(uiData)
    },
 })