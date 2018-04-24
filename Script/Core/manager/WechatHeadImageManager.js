/*******************************************************************************
Copyright (C), 2018, XXX Tech. Co., Ltd.
文 件 名: WechatHeadImageManager.js
作    者: lyn
创建日期: 2018-03-27
完成日期: 
功能描述: 
其它相关: 
修改记录: 
*******************************************************************************/

// 日志文件名
var LOG_FILE_NAME = 'WechatHeadImageManager.js.log'


var BaseManager = require("BaseManager")
var HEAD_CACHE_MAX = 50

var WechatHeadImageManager = cc.Class({
	extends:BaseManager,

	ctor:function(){
		this.m_headList = []
	},	

	init:function(msg){
		var self = this
		cc.loader.loadRes("game_main/Prefabs/ui/template/imgHead", cc.Prefab, function(err, prefab){
			self.templatePrefab = prefab
			cc.log("加载完成了，头像预制")
		})
	},

	/**
	 * @param  {[type]}
	 * @return {[type]}
	 */
	pushHeadInfo:function(headInfo){
		var _len = this.m_headList.length

		// 达到缓存，弹出一个
		if(_len >= HEAD_CACHE_MAX){
			this.popHeadInfo()
		}

		if(headInfo){
			this.m_headList.push(headInfo)
		}
	},

	/**
	 * @return {[type]}
	 */
	popHeadInfo:function(){
		this.m_headList.pop()
	},

	/**
	 * @param  {[type]}
	 * @return {[type]}
	 */
	createOneCacheHead:function(role_id){
		var _prefab = cc.instantiate(this.templatePrefab)
		var _tag = role_id
		var _info = {}
		_info.prefab = _prefab
		_info.tag = _tag
		return _info
	},

	/**
	 * @param  {string} url 头像路径
	 * @param  {string}	role_id 角色id
	 * @return {cc.Sprite} 微信头像
	 */
	getHeadSprite:function(url, role_id){
		// 从缓存获取
		for (var i = this.m_headList.length - 1; i >= 0; i--) {
			var _headInfo = this.m_headList[i]
			if(_headInfo.tag && _headInfo.tag == role_id){
				return _headInfo.prefab.getComponent(cc.Sprite)
			}
		}

		var _headInfo = this.createOneCacheHead(role_id)
		var self = this
		// 加载该玩家头像
       	cc.loader.load({url:url,type:"png"},function (err,tex) {
       		cc.log("请求一个微信头像")
            if(err){
            	cc.log("load url wechat failed")
            }
            if(tex){
            	self.pushHeadInfo(_headInfo)
                _headInfo.prefab.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(tex);
                globalEvent.emit("event_wechat_head_image", {tag : role_id, headInfo : _headInfo})
            }
        })
        return null
	},
})