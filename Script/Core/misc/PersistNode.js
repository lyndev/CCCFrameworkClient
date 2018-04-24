/*******************************************************************************
Copyright (C), 2016, XXX Tech. Co., Ltd.
文 件 名: PersistNode.js
作    者: lyn
创建日期: 2016-10-13
完成日期: 
功能描述: 将节点常驻游戏不销毁
其它相关: 
修改记录: 
*******************************************************************************/

// 日志文件名
var LOG_FILE_NAME = 'PersistNode.js.log'

cc.Class({
    extends: cc.Component,
    onLoad: function () {
        cc.game.addPersistRootNode(this.node)
    }
})
