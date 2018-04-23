/*******************************************************************************
Copyright (C), 2015-2019, RaTo Tech. Co., Ltd.
文 件 名: BaseManager.js
作    者: 刘伏波
创建日期: 2017-12-20
完成日期: 
功能描述: 
其它相关: 
修改记录: 
*******************************************************************************/

// 日志文件名
var LOG_FILE_NAME = 'BaseManager.js.log'

cc.Class({
    extends: cc.Component,
    init: function(msg) {
    	cc.log("<<<<<<<<<< init 管理器基类的调用 >>>>>>>>>")
    },

    update: function(dt){

    },

	onDestroy: function() {
        cc.log("<<<<<<<<<< onDestroy 管理器基类的调用 >>>>>>>>>")
    },
})