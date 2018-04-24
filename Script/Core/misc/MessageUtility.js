/*******************************************************************************
Copyright (C), 2015-2019, XXX Tech. Co., Ltd.
文 件 名: MessageUtility.js
作    者: lyn
创建日期: 2017-12-22
完成日期: 
功能描述: 
其它相关: 
修改记录: 
*******************************************************************************/

// 日志文件名
var LOG_FILE_NAME = 'MessageUtility.js.log'

var ProtobuffExtendHelper = require("ProtobuffExtendHelper")
var MsgRequire            = require("MsgRequire")
var ProtoBuf              = require("protobuf")
var PROTO_DIR  = "game_main/Proto"
var files = []

cc.Class({
    extends: cc.Component,


    initMsgRequire :function(){
        // 初始化所有的msgId和messageType的map
        var msgRequire = new MsgRequire()
        msgRequire.init()
    },

    // 遍历proto所在目录下的所有proto并异步加载到Builder
	loadAllProto : function(){

		// 实例化一个全局的Buidler
       	cc.GameMsg.Builder = ProtoBuf.newBuilder({ converFieldsToCamelCase: true })
 		       
        //获取PROTO_DIR下的所有文件名
        cc.loader._resources.getUuidArray(PROTO_DIR, null, files);
        var extname = 'proto'
        files = files.map((filePath) => {
            let str = filePath.substr(PROTO_DIR + 1);
            return `${str}.${extname}`;
        });
        return this.loadFromFile(files);
	},

	// 加载proto文件并加入到buidler
    loadFromFile(fileNames) {
        if (typeof fileNames === 'string') {
            fileNames = [fileNames];
        }

        let builder = cc.GameMsg.Builder
        builder.importRoot = cc.url.raw(`resources/${PROTO_DIR}`);

        fileNames.forEach((fileName) => {
            if(fileName != "Proto.proto"){
                let extname = cc.path.extname(fileName); 
                let fullPath = cc.url.raw("resources/" + fileName)
                if (extname === '.proto') {
                    if(cc.sys.platform != cc.sys.WECHAT_GAME){
                       ProtoBuf.loadProtoFile(fullPath, builder);
                        cc.log("加载["+fullPath+"]成功。")
                    } else if(cc.sys.platform == cc.sys.WECHAT_GAME) {
                        cc.loader.loadRes(fileName, function (err, proto) {
                            ProtoBuf.loadProto(proto, builder, fileName)  
                            cc.log("微信平台加载proto", fileName)
                        })  
                    }
                } else {
                    cc.log("不是.proto格式，过滤掉了。");
                }
            }
        });
    },

	// 根据消息id获取对应的proto结构
    getMsgStruct : function(msgId){
        var message = cc.GameMsg.Builder.build(cc.GameMsg.MSG_TYPE[msgId])
        return new message()
    },

    getBaseRpc : function(){
        var  message = cc.GameMsg.Builder.build("BaseMessage.Rpc")
        return new message()
    },

    getBaseRpcData : function(){
        var  message = cc.GameMsg.Builder.build("BaseMessage.RpcData")
        return new message()
    },
})
