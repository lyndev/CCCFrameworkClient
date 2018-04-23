/*******************************************************************************
Copyright (C), 2015-2019, RaTo Tech. Co., Ltd.
文 件 名: LocaMessageIdConfig.js
作    者: 刘伏波
创建日期: 2017-12-26
完成日期: 
功能描述: 消息说明和本地消息id手册注册
其它相关: 
修改记录: 
*******************************************************************************/

// 日志文件名
var LOG_FILE_NAME = 'LocaMessageIdConfig.js.log'
var LocaMessageIdConfig = cc.Class({
    extends: cc.Component,
	// 消息编号一共5位
	// 前三位为功能编号(100~999)(注:客户端本地功能独用编号:1-99
	// 第四位为来源(1:SC   2:CS  3:SS  4:CC)
	// 后两位为具体功能来源的消息编号(01~99)

	init:function () {
		// 游戏功能模块编号
		cc.GameMsg.MSG_FUNCTION = {
		    CONNECT         : 1,         // 连接服务器相关
		    UI              : 2,         // UI
		    Login           : 100,       // 登录
		}

		// 消息来源
		cc.GameMsg.MSG_SOURCE = {
		    SC : 1,     // 服务器->客户端
		    CS : 2,     // 客户端->服务器
		    SS : 3,     // 服务器->服务器
		    CC : 4,     // 客户端->客户端
		    WC : 6,     // 世界服务器->客户端
		}

		// 附加本地消息id（需要手动添加）
		cc.GameMsg.MSGID.CC_OPEN_UI  = 2401         // 打开UI
		cc.GameMsg.MSGID.CC_CLOSE_UI = 2402         // 关闭UI

		cc.log("本地消息id注册完毕")
	},
})