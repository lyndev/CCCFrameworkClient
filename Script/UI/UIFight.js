/*******************************************************************************
Copyright (C), 2015-2019, RaTo Tech. Co., Ltd.
文 件 名: UIFight.js
作    者: 刘伏波
创建日期: 2017-12-27
完成日期: 
功能描述: 
其它相关: 
修改记录: 
*******************************************************************************/

// 日志文件名
var LOG_FILE_NAME = 'UIFight.js.log'

var UIBase = require("UIBase")
var Speed = 4

cc.Class({
    extends: UIBase,

    properties: {
        role: cc.Node,
        btnLeft: cc.Node,
        btnRight: cc.Node,
        btnUp:cc.Node,
        btnDown:cc.Node,
        btnClose: cc.Node,
        moveFlag: "",
    },


    start () {
        cc.Client.UIStackManager.pushUI(this.__classname__, cc.Client.GameType.UIActionType.Hide)
        
        var self = this
        function onTouchDown(event) {
            self.onMove(event)
        }

        function onTouchUp(event) {
            self.onCancel(event)
        }

        cc.Client.UIHelper.AddClickEvent(this.btnClose, this.node, "onCloseThis", this.__classname__)

        this.btnLeft.on('touchstart', onTouchDown, this.btnLeft)
        this.btnLeft.on('touchend', onTouchUp, this.btnLeft)
        this.btnLeft.on('touchcancel', onTouchUp, this.btnLeft)

        this.btnRight.on('touchstart', onTouchDown, this.btnRight)
        this.btnRight.on('touchend', onTouchUp, this.btnRight)
        this.btnRight.on('touchcancel', onTouchUp, this.btnRight)

        this.btnUp.on('touchstart', onTouchDown, this.btnUp)
        this.btnUp.on('touchend', onTouchUp, this.btnUp)
        this.btnUp.on('touchcancel', onTouchUp, this.btnUp)

        this.btnDown.on('touchstart', onTouchDown, this.btnDown)
        this.btnDown.on('touchend', onTouchUp, this.btnDown)
        this.btnDown.on('touchcancel', onTouchUp, this.btnDown)
    },

    onCloseThis:function(){
        var msg = {
            name: this.__classname__,
        }
        cc.Client.UIManager.closeUI(msg)
    },

    onMove:function(event){
        var _node = event.target
        cc.log(_node.name)
        this.playAnim("bashen_move")
        if(_node.name == "btnUp"){
            this.moveFlag = "move_up"
        } else if (_node.name == "btnLeft"){
            this.moveFlag = "move_left"
        } else if(_node.name == "btnDown"){
            this.moveFlag = "move_down"
        } else if(_node.name == "btnRight"){
            this.moveFlag = "move_right"
        }
    },

    onCancel:function(event){
        this.moveFlag = ""
        this.playAnim("bashen_stand")
    },

    playAnim:function(animName){
        var _armature =  this.role.getComponent(dragonBones.ArmatureDisplay)
        _armature.armatureName = animName
        _armature.playAnimation(animName, 0)
    },

    update(dt){
        if(this.moveFlag!=""){
            if(this.moveFlag == "move_up"){
                this.roleMove(0, Speed)

            } else if(this.moveFlag == "move_down"){
                this.roleMove(0, -Speed)
                
            } else if(this.moveFlag == "move_left"){
                this.roleMove(-Speed, 0)
                
            } else if(this.moveFlag == "move_right"){
                this.roleMove(Speed, 0)
                
            }
        }
    },

    roleMove:function(x, y){
        if(this.role){
            this.role.x = this.role.x + x
            this.role.y = this.role.y + y
        }
    },

    onDestroy:function(){
        cc.log("UIFight onDestroy")
        cc.Client.UIStackManager.popUI(this.__classname__)
    },

});
