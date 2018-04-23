/*******************************************************************************
Copyright (C), 2015-2019, RaTo Tech. Co., Ltd.
文 件 名: ButtonScale.js
作    者: 刘伏波
创建日期: 2017-12-26
完成日期: 
功能描述: 
其它相关: 
修改记录: 
*******************************************************************************/

// 日志文件名
var LOG_FILE_NAME = 'ButtonScale.js.log'

cc.Class({
    extends: cc.Component,

    properties: {
        bGrayEffect: true, 
        bScale: true, 
        clickSFXName:'',
    },

    onDisable :function(){
        this.node.stopAllActions()
        cc.Client.UIHelper.ResetGrayNode(this.node)
        this.node.scale = this.initScale || 1                                                                          
    },

    onLoad: function () {
        var self = this
        var  pressedScalePercent = 0.95
        if(!self.bScale){
            pressedScalePercent = 1
        }

        self.initScale = this.node.scale
        self.pressedScale = this.node.scale * pressedScalePercent

        self.scaleDownAction = cc.scaleTo(0.05, self.pressedScale)
        self.scaleUpAction = cc.scaleTo(0.05, self.initScale)

        self.callBackAction = new cc.CallFunc(function (){
            if(self.bGrayEffect){
                cc.Client.UIHelper.ResetGrayNode(self.node)
            }
        }, this)

        function onTouchDown (event) {
            self.node.scale = self.initScale
            self.node.stopAllActions();
            if(self.bGrayEffect){
                cc.Client.UIHelper.GrayNode(self.node)
            }
            self.node.runAction(self.scaleDownAction)
            if(self.clickSFXName == ""){
                cc.Client.AudioManager.playSFX("button.mp3")
            }
        }

        function onTouchUp (event) {
            self.node.stopAllActions()
            var _actions = []
            var _delay = new cc.DelayTime(0.05)
            _actions.push(_delay)
            _actions.push(self.scaleUpAction)
            _actions.push(self.callBackAction)
            var _sq = new cc.Sequence(_actions)
            self.node.runAction(_sq)
        }
        
        this.node.on('touchstart', onTouchDown, this.node)
        this.node.on('touchend', onTouchUp, this.node)
        this.node.on('touchcancel', onTouchUp, this.node)
    }
});
