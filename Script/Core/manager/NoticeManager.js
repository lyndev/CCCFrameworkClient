/*******************************************************************************
Copyright (C), 2016, XXX Tech. Co., Ltd.
文 件 名: NoticeManager.js
作    者: 何伟
创建日期: 2016-12-12
完成日期: 
功能描述: 中心提示消息的管理器
其它相关: 
修改记录: 
*******************************************************************************/

// 日志文件名
var LOG_FILE_NAME = 'NoticeManager.js.log';

var BaseManager = require("BaseManager")
var UIManager   = require("UIManager")

var NoticeManager = cc.Class({
    extends: BaseManager,

    init: function(msg) {
        cc.log("INIT NoticeManager");
        this.noticeList = [];
        this.isNoticeUIOpen = false;
    },

    // 启动是否开始弹中心提示
    update: function (dt) {
        if (!this.noticeList) {
            this.noticeList = [];
        }
        var noticeListLength = this.noticeList.length;
        if (noticeListLength > 0 && this.isNoticeUIOpen == false) {
            this.setNoticeUIIsOpen(true);
            this.onOpenNoticeUI();
        } else if (noticeListLength <= 0 && this.isNoticeUIOpen == true) {
            this.setNoticeUIIsOpen(false);;
        }
    },

    // 打开提示的UI
    onOpenNoticeUI: function () {
        var contentText = this.noticeList[0];
        if (contentText) {
            var msg = {
                content: contentText,
                name: "UICenterNotice"
            }
            cc.Client.UIManager.openUI(msg)
        } else {
            cc.error("the center notice is empty content");
        }
    },

    // 接受提示消息时,向队列中增加
    onAddNotice: function(noticeContent) {
        if (noticeContent) {
            this.noticeList.push(noticeContent);
        }
        cc.log("提示队列的长度为", this.noticeList.length);
    },

    // 显示完成后,需要销毁从队列中移除
    onRemoveNotice: function () {
        this.noticeList.splice(0, 1);
    },

    // 获取提示的list
    getNoticeList: function() {
        return this.noticeList;
    },

    // 设置中心提示是否打开
    setNoticeUIIsOpen: function(bOpen) {
        this.isNoticeUIOpen = bOpen || false;
    },

    // 置空提示数据
    reSetNoticeData: function() {
        this.noticeList = [];
    },
});