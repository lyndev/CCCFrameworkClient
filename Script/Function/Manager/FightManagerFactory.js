/*******************************************************************************
Copyright (C), 2015-2019, XXX Tech. Co., Ltd.
文 件 名: FightManagerFactory.js
作    者: lyn
创建日期: 2018-04-04
完成日期: 
功能描述: 
其它相关: 
修改记录: 
*******************************************************************************/

// 日志文件名
var LOG_FILE_NAME = 'FightManagerFactory.js.log'

var BaseManager     = require("BaseManager")
var FightZJHManager = require("FightZJHManager")

var FightManagerFactory = cc.Class({
    extends: BaseManager,

    createFightManager:function(type, msg){
		var _mgr = null
		switch(type){
			case cc.Client.GameType.GameType.NN  : // 牛牛

				break;
			case cc.Client.GameType.GameType.MJ  : // 麻将

				break; 
			case cc.Client.GameType.GameType.DDZ : // 斗地主

				break; 
			case cc.Client.GameType.GameType.ZJH : // 扎金花
				_mgr = new FightZJHManager()
				break; 
			case cc.Client.GameType.GameType.TANK: // 坦克对战

				break;
		}
		_mgr.init(msg)
	    return _mgr
    },
})