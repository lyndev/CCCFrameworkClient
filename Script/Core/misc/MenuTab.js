/*******************************************************************************
Copyright (C), 2016, XXX Tech. Co., Ltd.
文 件 名: MenuTab.js
作    者: lyn
创建日期: 2016-10-28
完成日期: 
功能描述: 标签栏按钮组控制脚本
其它相关: 
修改记录: 
*******************************************************************************/

// 日志文件名
var LOG_FILE_NAME = 'MenuTab.js.log'
var GameConfig    = require("GameConfig")

cc.Class({
    extends: cc.Component,
    properties: {
        tabButtons: {
            default: [],
            type: cc.Node,
        },
        tabPanel:{
            default: [],
            type: cc.Node,
        },
        myRootPanel: cc.Node,
        activeSacel : true,
    },

    // use this for initialization
    onLoad: function () {
        this.currentTabIndex = 0,
        this.currentShowPanelIndex = 0,

        // 绑定标签页的按钮事件
        this.node.on("tabPressed", this.onTabPressed.bind(this))
    },

    onTabPressed: function(event){
        var curTabIndex = event.detail.index
        if (this.currentTabIndex == curTabIndex) {
            cc.log("is same index ")
            return
        }
        
        if(this.myRootPanel){
            this.myRootPanel.emit("tabChange", {tabType: event.detail.tabType} );
        }

        // 隐藏上一个索引的panel
        var lastPanel = this.tabPanel[this.currentShowPanelIndex]
        if (lastPanel) {
            lastPanel.active = false
        }

        // 显示当前点击的标签的panel
        var curPanel = this.tabPanel[curTabIndex]
        if (curPanel) {
            curPanel.active = true
        }

        cc.log("tab tabPressed", curTabIndex)

        // 是否启用按钮缩放
        if(this.activeSacel){
            var lastTagButton = this.tabButtons[this.currentShowPanelIndex]
            if (lastTagButton) {
                lastTagButton.scaleX = 0.8
                lastTagButton.scaleY = 0.8
            }

            // 显示当前点击的标签的panel
            var curPanel = this.tabPanel[curTabIndex]
            if (curPanel) {
                curPanel.active = true
            }

            var curTagButton = this.tabButtons[curTabIndex]
            if (curTagButton) {
                curTagButton.scaleX = 1
                curTagButton.scaleY = 1
            }
        }
        this.currentTabIndex = curTabIndex
        this.currentShowPanelIndex = curTabIndex
    },
});
