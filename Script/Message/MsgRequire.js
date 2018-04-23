//********************************************************************************
//  generate: protoForJsTableTool
//  version: v1.0.1
//  author: UndaKunteera
//********************************************************************************

cc.GameMsg = {}
cc.GameMsg.MSGID = {}
cc.GameMsg.MSG_TYPE = {}

cc.Class({
    extends: cc.Component,
    init: function(){
        var Msg_Backpack = require("Msg_Backpack")
        var Msg_BaseMessage = require("Msg_BaseMessage")
        var Msg_Chat = require("Msg_Chat")
        var Msg_Friend = require("Msg_Friend")
        var Msg_Login = require("Msg_Login")
        var Msg_Mail = require("Msg_Mail")
        var Msg_NewFeature = require("Msg_NewFeature")
        var Msg_Notify = require("Msg_Notify")
        var Msg_OperActivity = require("Msg_OperActivity")
        var Msg_Player = require("Msg_Player")
        var Msg_Rank = require("Msg_Rank")
        var Msg_Rebate = require("Msg_Rebate")
        var Msg_Recharge = require("Msg_Recharge")
        var Msg_Room = require("Msg_Room")
        var Msg_SignIn = require("Msg_SignIn")
        var Msg_Task = require("Msg_Task")
        var Msg_Vip = require("Msg_Vip")

        var _Msg_Backpack = new Msg_Backpack()
        var _Msg_BaseMessage = new Msg_BaseMessage()
        var _Msg_Chat = new Msg_Chat()
        var _Msg_Friend = new Msg_Friend()
        var _Msg_Login = new Msg_Login()
        var _Msg_Mail = new Msg_Mail()
        var _Msg_NewFeature = new Msg_NewFeature()
        var _Msg_Notify = new Msg_Notify()
        var _Msg_OperActivity = new Msg_OperActivity()
        var _Msg_Player = new Msg_Player()
        var _Msg_Rank = new Msg_Rank()
        var _Msg_Rebate = new Msg_Rebate()
        var _Msg_Recharge = new Msg_Recharge()
        var _Msg_Room = new Msg_Room()
        var _Msg_SignIn = new Msg_SignIn()
        var _Msg_Task = new Msg_Task()
        var _Msg_Vip = new Msg_Vip()

        _Msg_Backpack.init()
        _Msg_BaseMessage.init()
        _Msg_Chat.init()
        _Msg_Friend.init()
        _Msg_Login.init()
        _Msg_Mail.init()
        _Msg_NewFeature.init()
        _Msg_Notify.init()
        _Msg_OperActivity.init()
        _Msg_Player.init()
        _Msg_Rank.init()
        _Msg_Rebate.init()
        _Msg_Recharge.init()
        _Msg_Room.init()
        _Msg_SignIn.init()
        _Msg_Task.init()
        _Msg_Vip.init()
    }
})