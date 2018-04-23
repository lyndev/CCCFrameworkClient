/*******************************************************************************
Copyright (C), 2015-2019, RaTo Tech. Co., Ltd.
文 件 名: PlayerManager.js
作    者: 刘伏波
创建日期: 2018-04-02
完成日期: 
功能描述: 
其它相关: 
修改记录: 
*******************************************************************************/

// 日志文件名
var LOG_FILE_NAME = 'PlayerManager.js.log'

var BaseManager    = require("BaseManager")

var PlayerManager = cc.Class({
		extends: BaseManager,

		ctor:function() {
			this.m_playerInfo = null
			this.m_serverTime = 0
		},

		init:function(msg){
			cc.Client.MessageManager.register(this, cc.GameMsg.MSGID.SC_LOGIN_RESNOTLOGIN, function(msgId, msgData){ 
				cc.Client.UIHelper.UICenterNotice("玩家没有登录，返回登录界面重试")
				cc.Client.UIManager.closeAllUI()
				var _msg = {}
				_msg.name = "UILogin"
				cc.Client.UIManager.openUI(_msg)
			})
		},

		setPlayerInfo:function(msg){
			this.m_playerInfo = msg.playerInfo
		},

		getRoleId:function(){
			return this.m_playerInfo.roleId
		},

		getUserId:function(){
			return this.m_playerInfo.userId
		},

		getRoleName:function(){
			return this.m_playerInfo.roleName
		},

		isVip:function(){

		},

		getGem:function(){

		},

		getHeadURL:function(){
			var _default_url = "http://wx.qlogo.cn/mmopen/g3MonUZtNHkdmzicIlibx6iaFqAc56vxLSUfpb6n5WKSYVY0ChQKkiaJSgQ1dZuTOgvLLrhJbERQQ4eMsv84eavHiaiceqxibJxCfHe/0"
			var _wechatInfo = cc.Client.WechatPlatformManager.getWechatInfo()
			var _url =  _default_url
			if(_wechatInfo && _wechatInfo.headimgurl){
				cc.Client.WechatPlatformManager.Log("get wechat headimgurl" + _wechatInfo.headimgurl)
				_url = _wechatInfo.headimgurl
			}
			var arr = _url.split("/")
			arr.pop()
			var _new_url = arr.join("/")

			_new_url = _new_url + "/96"
			return _new_url
		},

		getCoin:function(){
			return this.m_playerInfo.coin
		},

		getScore:function(){
			return this.m_playerInfo.score
		},

		getSex:function(){
			return this.m_playerInfo.sex
		},

		getUserName:function(){
			return this.m_playerInfo.userName
		},

		setServerTime:function(server_time){
			this.m_serverTime = server_time
		},

		getServerTime:function(){
			return this.m_serverTime
		},

		syncServerTime:function(server_time) {
			this.setServerTime(server_time)
		},

		setReconnectToken:function(token){
			this.m_token = token
		},

		getReconnectToken:function(token){
			return this.m_token
		},

		isLogin:function(){
			return this.m_bLogin
		},

		setLogin:function(bLogin){
			this.m_bLogin =bLogin
		},

		update:function(dt){
			var _dtMs = dt * 1000
			this.m_serverTime = this.m_serverTime + _dtMs
		},
})