/*******************************************************************************
Copyright (C), 2016, RaTo Tech. Co., Ltd.
文 件 名: cc.Client.Utility.js
作    者: 刘伏波
创建日期: 2016-10-26
完成日期: 
功能描述: 工具类
其它相关: 汉字检查范围:\u4e00-\u9fa5
修改记录: 
*******************************************************************************/

// 日志文件名
var LOG_FILE_NAME = 'cc.Client.Utility.js.log'
var GameType = require("GameType")

/*
用法(异步加载):
    loadImage(info.url,userid,function (err,spriteFrame) {
        self._spriteFrame = spriteFrame;
        // self._spriteFrame 就是实例化出来的一张图片
    });   
*/
var loadImage = function(url,code,callback){
    /*
    if(cc.vv.images == null){
        cc.vv.images = {};
    }
    var imageInfo = cc.vv.images[url];
    if(imageInfo == null){
        imageInfo = {
            image:null,
            queue:[],
        };
        cc.vv.images[url] = imageInfo;
    }
    
    cc.loader.load(url,function (err,tex) {
        imageInfo.image = tex;
        var spriteFrame = new cc.SpriteFrame(tex, cc.Rect(0, 0, tex.width, tex.height));
        for(var i = 0; i < imageInfo.queue.length; ++i){
            var itm = imageInfo.queue[i];
            itm.callback(itm.code,spriteFrame);
        }
        itm.queue = [];
    });
    if(imageInfo.image != null){
        var tex = imageInfo.image;
        var spriteFrame = new cc.SpriteFrame(tex, cc.Rect(0, 0, tex.width, tex.height));
        callback(code,spriteFrame);
    }
    else{
        imageInfo.queue.push({code:code,callback:callback});
    }*/
    cc.loader.load(url,function (err,tex) {
        var spriteFrame = new cc.SpriteFrame(tex, cc.Rect(0, 0, tex.width, tex.height));
        callback(code,spriteFrame);
    });
}

// 格式化时间为：mm:ss
var FormatTimeAsMMSS = function (ms) {
	ms = Number(ms)
	ms = Math.floor(ms)
	var showTime = (new Date(ms)).Format("mm:ss")
	return showTime
}

// 格式化时间为：yyyy-MM-dd hh:mm:ss
var FormatTimeAsYYYYMMDDMMSS = function (ms) {
	ms = Number(ms)
	ms = Math.floor(ms)
	var showTime = (new Date(ms)).Format("yyyy-MM-dd hh:mm:ss")
	return showTime
}

// 格式化时间为：hh:mm:ss
var FormatTimeAsHHMMSS = function (ms) {
	ms = Number(ms)
	ms = Math.floor(ms)
	var showTime = (new Date(ms)).Format("hh:mm:ss")
	return showTime
}

// 格式化时间为：yyyy-MM-dd
var FormatTimeAsYYYYMMDD = function (ms) {
	ms = Number(ms)
	ms = Math.floor(ms)
	var showTime = (new Date(ms)).Format("yyyy-MM-dd")
	return showTime
}

// 根据毫秒数获取天数
var getDays = function(m){
	var s = m * 0.001
	var m = s / 60
	var h = m / 60
	var day = h / 24
	return day
}

// 判断字符是不是汉字
var isChinese = function (str){  
 	var patrn = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi;
	if(!patrn.exec(str)){
		return false;
	} else{
		return true;
	}
}


// 计算字符宽度
var CalcTextContentSize = function(str, fontSize){
	var _totalWidth = 0
    for (var i = str.length - 1; i >= 0; i--) {
        var s = str[i]
        var bCh = isChinese(s)
        if(bCh){
            _totalWidth += (fontSize || 40 )
        } else {
            _totalWidth += (fontSize || 40 ) * 0.5
        } 
    }  
    return _totalWidth
}

// 根据毫秒获取年月日
var getTimeWithYYYYMMDD = function (ms) {
	ms = Number(ms)
	ms = Math.floor(ms)
	var showTime = (new Date(ms)).Format("yyyy-MM-dd")
	return showTime
}

// 判断字符个数
var getByteLen = function(val) {
    var len = 0;
    for (var i = 0; i < val.length; i++) {
        if (val[i].match(/[^\x00-\xff]/ig) != null) //全角
            len += 2;
        else
            len += 1;
    }
    return len;
}

// 判断只能含有汉字和字母
var checkOnlyHaveChineseOrLetter = function(str)
{
	 if(escape(str).indexOf("%u") == -1 && str.match(/\D/)==null){
	 	return false
	 }  
	return true
}

// 检查帐号的规则合法性
var checkAccountValid = function(str){
    for (var i = 0; i < str.length; i++) {
    	var char = str[i]
    	var bInvalid = /[a-z0-9_@_#.]/.test(char)
    	if(!bInvalid){
    		return false
    	}
    }
    return true
}

// 检测注册账号的规则的合法性
var checkRegisterAccountValid = function(str){
    for (var i = 0; i < str.length; i++) {
    	var char = str[i]
    	var bInvalid = /[a-z0-9_@.]/.test(char)
    	if(!bInvalid){
    		return false
    	}
    }
    return true
}

// 检查帐号的长度合法性
var checkAccountLengthValid = function(str){
	var len = str.length
	if(len>=4 && len <=24){
		return true
	}
	return false
}

// 检查密码的规则合法性
var checkPasswordValid = function(str){
    for (var i = 0; i < str.length; i++) {
    	var char = str[i]
    	var bInvalid = /[a-zA-Z0-9_@.]/.test(char)
    	if(!bInvalid){
    		return false
    	}
    }
    return true
}

// 检查密码的长度合法性
var checkPasswordLengthValid = function(str){
	var len = str.length
	if(len>=8 && len <=24){
		return true
	}
	return false
}

// 检测昵称的长度是否合法
var checkNickNameLengthValid = function(str){
	var len = str.length
	if(len>=2 && len <=12){
		return true
	}
	return false
}

// 检测昵称的规则是否合法
var checkNickNameValid = function(str){
	for (var i = 0; i < str.length; i++) {
    	var char = str[i]
    	var bInvalid = /^[\u4e00-\u9fa5a-zA-Z]/.test(char)
    	if(!bInvalid){
    		return false
    	}
    }
    return true
}

// 检测手机号长度是否合法
var checkPhoneNumberLengthValid = function(str){
	var len = str.length
	if(len == 11){
		return true
	}
	return false
}

// 检测手机号是否合法
var checkPhoneNumberValid = function(str){
	for (var i = 0; i < str.length; i++) {
    	var char = str[i]
    	var bInvalid = /[0-9]/.test(char)
    	if(!bInvalid){
    		return false
    	}
    }
    return true
}

var checkNumberValid = function(str){
    return checkPhoneNumberValid(str)
}

// 检测验证码长度是否合法
var checkVerifyNumberLengthValid = function(str){
	var len = str.length
	if(len == 4){
		return true
	}
	return false
}

// 检测验证码是否符合规则
var checkVerifyNumberValid = function(str){
	for (var i = 0; i < str.length; i++) {
    	var char = str[i]
    	var bInvalid = /[0-9]/.test(char)
    	if(!bInvalid){
    		return false
    	}
    }
    return true
}

// 创建擂台的长度判断
var checkArenaLengthValid = function(str){
	var len = str.length
	if(len>=1 && len <=8){
		return true
	}
	return false
}

//保留2位小数
var changeTwoDecimal= function(floatvar)
{
	var f_x = parseFloat(floatvar);
	if (isNaN(f_x))
	{
		return false;
	}
	var f_x = Math.round(floatvar*100)/100;
	return f_x;
}

var getMainLogic = function(argument) {
    var GameMainLogic = cc.find("GameMainLogic")
    if(GameMainLogic){
        var gameMainLogic = GameMainLogic.getComponent("GameMainLogic")
        return gameMainLogic
    }	
}

var dump = function(msg, msgContent){
	msgContent = msgContent || ""
    var _string = JSON.stringify(msg)
/*	for(var key in msg){
		if(typeof(msg[key]) != 'function'){
			msgContent = msgContent + "数据字段:" + key + " 数据类型:" + msg[key] + "\n"
			if(msg[key] && typeof(msg[key]) == 'object' && msg[key].constructor.name != "Array"){
				return dump(msg[key], msgContent)
			}
		}
	}*/
	return _string
}

var dumpMsg = function(msgId, msgType, msg, type){
    var Str = {}
    Str[GameType.MsgActionType.Send] = "发送"
    Str[GameType.MsgActionType.Recv] = "接受"
    Str[GameType.MsgActionType.Test] = "测试"

	var content = dump(msg)
	cc.log("\n=================【"+Str[type]+"】消息数据=====================")
	cc.log("   消息ID:"+ msgId + " 消息类型:" + msgType)
	cc.log(content)
	cc.log("\n====================================================")
}

var dumpObj =  function(obj,tag){ 
    cc.log("\n=================【"+( tag || "") +"】打印数据=====================")
     var _string = JSON.stringify(obj)
     cc.log(_string)
}

var pointToLineDis = function(point, p1, p2){
	var p0 = p1, p1 = p2,p = point
	var dis
	if(p1.x==p0.x)
	{
	　　dis=Math.abs(p1.x-p.x)
	}
	else
	{
	　　var k=-((p0.y-p1.y)/(p0.x-p1.x))
	　　var b=(p0.y*p1.x-p1.y*p0.x)/(p1.x-p0.x)
	　　dis=Math.abs(k*p.x+1*p.y+b)/Math.sqrt(1+k*k)
	}
	return dis
}

// 判断两直线相交（有值 相交, false不相交）
var segmentsIntr = function(a, b, c, d){  
  
    // 三角形abc 面积的2倍  
    var area_abc = (a.x - c.x) * (b.y - c.y) - (a.y - c.y) * (b.x - c.x);  
  
    // 三角形abd 面积的2倍  
    var area_abd = (a.x - d.x) * (b.y - d.y) - (a.y - d.y) * (b.x - d.x);   
  
    // 面积符号相同则两点在线段同侧,不相交 (对点在线段上的情况,本例当作不相交处理);  
    if ( area_abc*area_abd>=0 ) {  
        return false;  
    }  
  
    // 三角形cda 面积的2倍  
    var area_cda = (c.x - a.x) * (d.y - a.y) - (c.y - a.y) * (d.x - a.x); 

    // 三角形cdb 面积的2倍  
    // 注意: 这里有一个小优化.不需要再用公式计算面积,而是通过已知的三个面积加减得出.  
    var area_cdb = area_cda + area_abc - area_abd ;  
    if (  area_cda * area_cdb >= 0 ) {  
        return false;  
    }  
  
    //计算交点坐标  
    var t = area_cda / ( area_abd- area_abc );  
    var dx= t*(b.x - a.x),  
        dy= t*(b.y - a.y);  
    return { x: a.x + dx , y: a.y + dy };  
}

var PointLine_Disp = function(point, p1, p2){
 	
 	var xx = point.x
 	var yy = point.y
 	var x1 = p1.x
 	var y1 = p1.y
 	var x2 = p2.x
 	var y2 = p2.y
	var a, b, c, ang1, ang2, ang, m;  
    var result = 0;  
    //分别计算三条边的长度  
    a = Math.sqrt((x1 - xx) * (x1 - xx) + (y1 - yy) * (y1 - yy));  
    if (a == 0)  
        return -1;  
    b = Math.sqrt((x2 - xx) * (x2 - xx) + (y2 - yy) * (y2 - yy));  
    if (b == 0)  
        return -1;  
    c = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));  
    //如果线段是一个点则退出函数并返回距离  
    if (c == 0)  
    {  
        result = a;  
        return result;  
    }  
    //如果点(xx,yy到点x1,y1)这条边短  
    if (a < b)  
    {  
        //如果直线段AB是水平线。得到直线段AB的弧度  
        if (y1 == y2)  
        {  
            if (x1 < x2)  
                ang1 = 0;  
            else  
                ang1 = Math.PI;  
        }  
        else  
        {  
            m = (x2 - x1) / c;  
            if (m - 1 > 0.00001)  
                m = 1;  
            ang1 = Math.acos(m);  
            if (y1 >y2)  
                ang1 = Math.PI*2  - ang1;//直线(x1,y1)-(x2,y2)与折X轴正向夹角的弧度  
        }  
        m = (xx - x1) / a;  
        if (m - 1 > 0.00001)  
            m = 1;  
        ang2 = Math.acos(m);  
        if (y1 > yy)  
            ang2 = Math.PI * 2 - ang2;//直线(x1,y1)-(xx,yy)与折X轴正向夹角的弧度  
         
        ang = ang2 - ang1;  
        if (ang < 0) ang = -ang;  
         
        if (ang > Math.PI) ang = Math.PI * 2 - ang;  
        //如果是钝角则直接返回距离  
        if (ang > Math.PI / 2)  
            return a;  
        else  
            return a * Math.sin(ang);  
    }  
    else//如果(xx,yy)到点(x2,y2)这条边较短  
    {  
        //如果两个点的纵坐标相同，则直接得到直线斜率的弧度  
        if (y1 == y2)  
            if (x1 < x2)  
                ang1 = Math.PI;  
            else  
                ang1 = 0;  
        else  
        {  
            m = (x1 - x2) / c;  
            if (m - 1 > 0.00001)  
                m = 1;  
            ang1 = Math.acos(m);  
            if (y2 > y1)  
                ang1 = Math.PI * 2 - ang1;  
        }  
        m = (xx - x2) / b;  
        if (m - 1 > 0.00001)  
            m = 1;  
        ang2 = Math.acos(m);//直线(x2-x1)-(xx,yy)斜率的弧度  
        if (y2 > yy)  
            ang2 = Math.PI * 2 - ang2;  
        ang = ang2 - ang1;  
        if (ang < 0) ang = -ang;  
        if (ang > Math.PI) ang = Math.PI * 2 - ang;//交角的大小  
        //如果是对角则直接返回距离  
        if (ang > Math.PI / 2)  
            return b;  
        else  
            return b * Math.sin(ang);//如果是锐角，返回计算得到的距离  
    }  
} 


var VISIBLE_WIDTH = function(){
    return cc.director.getVisibleSize().width
}

var VISIBLE_HEIGHT = function(){
    return cc.director.getVisibleSize().height
}

// http请求
// @url 请求地址
// @callback 回调
var SendHttpRequest=function(url, callback, tag){
    var self = this
    var _callback = callback
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
            var response = xhr.responseText
            if(_callback){
                _callback(response)
            }
        }
    }
    xhr.open("GET", url, true)
    xhr.send()
}


var getHexNumber = function(str){
    return Number('0x'+str.toString(16))
}

module.exports = {
	FormatTimeAsMMSS : FormatTimeAsMMSS,
	FormatTimeAsYYYYMMDDMMSS: FormatTimeAsYYYYMMDDMMSS,
    FormatTimeAsHHMMSS: FormatTimeAsHHMMSS,
    FormatTimeAsYYYYMMDD: FormatTimeAsYYYYMMDD,
	isChinese: isChinese,
	CalcTextContentSize: CalcTextContentSize,
	getDays: getDays,
	checkOnlyHaveChineseOrLetter: checkOnlyHaveChineseOrLetter,
	getByteLen: getByteLen,
	checkAccountValid: checkAccountValid,
	checkAccountLengthValid: checkAccountLengthValid,
	checkPasswordValid: checkPasswordValid,
	checkPasswordLengthValid: checkPasswordLengthValid,
	checkNickNameLengthValid : checkNickNameLengthValid,
	checkNickNameValid : checkNickNameValid,
	checkPhoneNumberLengthValid : checkPhoneNumberLengthValid,
	checkPhoneNumberValid : checkPhoneNumberValid,
	checkVerifyNumberLengthValid : checkVerifyNumberLengthValid,
	checkVerifyNumberValid : checkVerifyNumberValid,
	checkRegisterAccountValid:checkRegisterAccountValid,
	checkArenaLengthValid:checkArenaLengthValid,
	changeTwoDecimal:changeTwoDecimal,
	getMainLogic:getMainLogic,
	dump : dump,
	dumpMsg:dumpMsg,
	pointToLineDis: pointToLineDis,
	segmentsIntr: segmentsIntr,
	PointLine_Disp: PointLine_Disp,
    checkNumberValid:checkNumberValid,
    VISIBLE_WIDTH:VISIBLE_WIDTH,
    VISIBLE_HEIGHT:VISIBLE_HEIGHT,
    dumpObj:dumpObj,
    SendHttpRequest:SendHttpRequest,
    getHexNumber: getHexNumber,
}
