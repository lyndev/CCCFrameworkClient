/*******************************************************************************
Copyright (C), 2016, XXX Tech. Co., Ltd.
文 件 名: GameConfig.js
作    者: lyn
创建日期: 2016-10-13
完成日期: 
功能描述: 游戏配置相关
其它相关: 
修改记录: 
*******************************************************************************/

// 日志文件名
var LOG_FILE_NAME = 'GameConfig.js.log'
var GameType = require("GameType")

var ip_type = cc.Enum({
    server_ip_Test: 0,
    localhost: 1,
	myselfRoom:2,
	myselfCompany41:3,
	myselfCompany40:4,
	aliyun:5,
})

// 服务器的ip列表
var ip_config = [
	"ws://echo.websocket.org",	// ip_type.server_ip_Test
    "ws://127.0.0.1:10086",  // ip_type.localhost
	"ws://192.168.0.195:10086",	// ip_type.myselfRoom
	"ws://192.168.1.41:10086",	// ip_type.myselfCompany41
	"ws://192.168.1.40:10086",	// ip_type.myselfCompany40
	"ws://47.106.91.153:10086",	// ip_type.myselfCompany40
]

module.exports = {
	ip_type : ip_type,
	ip_config : ip_config,
}