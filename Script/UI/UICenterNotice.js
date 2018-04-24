/*******************************************************************************
Copyright (C), 2016, XXX Tech. Co., Ltd.
文 件 名: UICenterNotice.js
作    者: lyn
创建日期: 2016-10-17
完成日期: 
功能描述: 
其它相关: 
修改记录: 
*******************************************************************************/

// 日志文件名
var LOG_FILE_NAME = 'UICenterNotice.js.log'

var UIManager        = require("UIManager")
var NoticeManager    = require("NoticeManager")
var NOTICE_WAIT_TIME = 1.5

cc.Class({
    extends: cc.Component,
    properties: {
        bg: cc.Sprite,
        txtNotice: cc.Label,
        animNode: cc.Node,
    },

    onLoad: function () {
        this.bg.node.width = this.txtNotice.node.width + 35
    },

    // 初始化UI数据
    init: function (msg) {
        if (msg) {
            this.node.active = true
            this.animNode.y = 0
            var anim = this.animNode.getComponent(cc.Animation)
            anim.play()
            if (this.txtNotice) {
                this.txtNotice.string = msg.content

            } else {
                cc.error("not find the content label")
            }
        } else {
            cc.error("UICenterNotice msg is null")
        }
        this.schedule(this.onShowFinish, NOTICE_WAIT_TIME);
    },

    // 显示完成后在判断是否还有提示在队列中
    onShowFinish: function(){

        // 把本条数据移除
        cc.Client.NoticeManager.onRemoveNotice()
        this.node.active = false
        // 判断队列是否还有数据
        var noticeList = cc.Client.NoticeManager.getNoticeList()
        if(noticeList.length <= 0 ){
            cc.log("提示消息队列为空")
            //this.Destroy()
        }else{
            cc.log("提示消息队列不为空,长度为",noticeList.length)
            var msg = {}
            msg.content = noticeList[0]
            this.init(msg)
        }
    },

    Destroy: function(){
        cc.Client.NoticeManager.setNoticeUIIsOpen(false)
        cc.Client.NoticeManager.reSetNoticeData()
        this.node.destroy()
    }
})