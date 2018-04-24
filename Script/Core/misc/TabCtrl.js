/*******************************************************************************
Copyright (C), 2016, XXX Tech. Co., Ltd.
文 件 名: TabCtrl.js
作    者: lyn
创建日期: 2016-10-28
完成日期: 
功能描述: 标签按钮按钮时间
其它相关: 
修改记录: 
*******************************************************************************/

// 日志文件名
var LOG_FILE_NAME = 'TabCtrl.js.log'

cc.Class({
    extends: cc.Component,
    properties: {
        index: 0, 				// 索引
        receiver: cc.Node, 		// 事件接收者
    },

    onPressed() {
        this.receiver.emit("tabPressed", {index:this.index, tabType: this.getComponent("TabType").tabType} );
    },
});
