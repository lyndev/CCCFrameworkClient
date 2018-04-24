/*******************************************************************************
Copyright (C), 2016, XXX Tech. Co., Ltd.
文 件 名: UIBase.js
作    者: lyn
创建日期: 2016-11-09
完成日期: 
功能描述: 
其它相关: 
修改记录: 
*******************************************************************************/

// 日志文件名
var LOG_FILE_NAME = 'UIBase.js.log'

var UIManager = require("UIManager")

cc.Class({
    extends: cc.Component,

    init: function(msg) {
    	cc.log(" init 这UI基类的调用:", this.node.name)
    },

	onDestroy: function() {
        cc.log(" onDestroy UI基类的调用:", this.node.name)
        globalEvent.targetOff(this)
        if(this.name && this.name != ""){
       		cc.Client.UIManager.removeUIName(this.node.name)
        }
    },
})