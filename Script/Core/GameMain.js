/*******************************************************************************
Copyright (C), 2016, XXX Tech. Co., Ltd.
文 件 名: GameMainLogic.js
作    者: lyn
创建日期: 2016-10-13
完成日期: 
功能描述: 游戏主逻辑
其它相关: 
修改记录: 
*******************************************************************************/

// 日志文件名
var LOG_FILE_NAME       = 'GameMainLogic.js.log'

var MessageUtility         = require("MessageUtility")
var UIHelper               = require("UIHelper")
var GameWebsocket          = require("GameWebsocket")
var MessageManager         = require("MessageManager")
var UIManager              = require("UIManager")
var GameConfig             = require("GameConfig")
var Utility                = require("Utility")
var UIStackManager         = require("UIStackManager")
var NoticeManager          = require("NoticeManager")
var ShaderUtility          = require("ShaderUtility")
var GameType               = require("GameType")
var AudioManager           = require("AudioManager")
var WechatPlatformManager  = require("WechatPlatformManager")
var WechatHeadImageManager = require("WechatHeadImageManager")
var PlayerManager          = require("PlayerManager")
var FightManagerFactory    = require("FightManagerFactory")
var LobbyManager           = require("LobbyManager")
var CardHelper             = require("CardHelper")

// 对Date的扩展，将 Date 转化为指定格式的String   
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
// 例子：   
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18   
Date.prototype.Format = function(fmt)   
{  
  var o = {   
    "M+" : this.getMonth()+1,                 // 月份   
    "d+" : this.getDate(),                    // 日   
    "h+" : this.getHours(),                   // 小时   
    "m+" : this.getMinutes(),                 // 分   
    "s+" : this.getSeconds(),                 // 秒   
    "q+" : Math.floor((this.getMonth()+3)/3), // 季度   
    "S"  : this.getMilliseconds()             // 毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt = fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
}  

cc.Class({
    extends: cc.Component,
    gameWebSokcet: null,
    properties: {
        _N$ipType: GameConfig.ip_type.server_ip_Test,
        ip_type : {
            type: GameConfig.ip_type,
            get: function() {
                return this._N$ipType;
            },
            set: function(value) {
                this._N$ipType = value;
                this.currentIP = GameConfig.ip_config[value]
            },
        },
        currentIP : GameConfig.ip_config[0],
    },

    onLoad: function () {
        cc.log("当前平台：", cc.sys.os)
        cc.Client = {}
        cc.Client.UIHelper = new UIHelper()
        var messageUtility = new MessageUtility()
        cc.Client.MessageUtility = messageUtility
        cc.Client.ShaderUtility = new ShaderUtility()

        cc.Client.GameType = GameType
        cc.Client.Utility = Utility
        cc.Client.MessageUtility.initMsgRequire()
        cc.Client.MessageUtility.loadAllProto()
        
        // 游戏业务逻辑事件系统
        window.globalEvent = new cc.EventTarget()
        
        // 开启碰撞检测
        //cc.director.getCollisionManager().enabled = true;
        // 游戏退出响应事件
        this.initRegisterEventExit()
        // 游戏切换后台事件响应
        this.initRegisterEventOnGameHide()
        // 游戏切换前台事件响应
        this.initRegisterEventOnGameShow()
        // 初始化核心功能模块
        this.initCoreModules()
        // 初始化游戏功能模块
        this.initFunctionModules() 

        // 登录界面
        var msg = {
            name : "UILogin",
        }
        cc.Client.UIManager.openUI(msg)
    },

    // 初始化游戏核心模块
    initCoreModules: function() {

        cc.Client.MessageManager = new MessageManager()
        cc.Client.UIManager = new UIManager()
        cc.Client.UIStackManager = new UIStackManager()
        cc.Client.NoticeManager = new NoticeManager()
        cc.Client.GameWebsocket = new GameWebsocket()
        cc.Client.AudioManager = new AudioManager()
        cc.Client.WechatPlatformManager = new WechatPlatformManager()
        cc.Client.WechatHeadImageManager = new WechatHeadImageManager()
        cc.Client.PlayerManager = new PlayerManager()
        cc.Client.FightManagerFactory = new FightManagerFactory()
        cc.Client.LobbyManager = new LobbyManager()
        cc.Client.CardHelper = new CardHelper()

        cc.Client.LobbyManager.init()
        cc.Client.PlayerManager.init()
        cc.Client.WechatPlatformManager.init()
        cc.Client.WechatHeadImageManager.init()
        cc.Client.MessageManager.init()
        cc.Client.UIManager.init()
        cc.Client.UIStackManager.init()
        cc.Client.NoticeManager.init()
        cc.Client.AudioManager.init()
    },

    // 初始化游戏功能模块
    initFunctionModules: function() {
        //PlayerManager.getInstance().init()
    },

    // 注册退出app事件
    initRegisterEventExit: function(argument) {
        var self = this
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function(keyCode, event) {
                if(keyCode == cc.KEY.back){
                    cc.log("退出游戏")
                    self.exitGame()
                }
            }
        }, this.node)
    },

    exitGame: function(){
        var msg = {
            name : "UITipsCommonTwice",
            args : {},
            content : "确认退出游戏?",
            callback : this.endGame,
        }
        cc.Client.UIManager.openUI(msg)
    },

    endGame: function(){
        cc.game.end()
    },

    update: function(dt) {
        cc.Client.MessageManager.update(dt)
        cc.Client.UIManager.update(dt)
        cc.Client.UIStackManager.update(dt)
        cc.Client.NoticeManager.update(dt)
        cc.Client.GameWebsocket.update(dt)
    },

    // 销毁游戏核心模块
    destroyCoreModules: function() {
    },

    // 销毁游戏功能模块
    destroyFunctionModules: function() {

    },

    // 注册游戏切换到后台事件
    initRegisterEventOnGameHide: function(){
        cc.game.on(cc.game.EVENT_HIDE, function(event) {
            cc.log("注册游戏切换到后台事件")
        });
    },

    // 游戏切换到回来的事件
    initRegisterEventOnGameShow: function(){
        cc.game.on(cc.game.EVENT_SHOW, function(event) {
            cc.log("注册游戏切换到前台事件")
        });
    },

    onDestroy: function(){    
        this.destroyCoreModules()
        this.destroyFunctionModules()
    }
})