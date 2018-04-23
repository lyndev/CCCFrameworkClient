/*******************************************************************************
Copyright (C), 2015-2019, RaTo Tech. Co., Ltd.
文 件 名: ProtobuffExtendHelper.js
作    者: 刘伏波
创建日期: 2017-12-26
完成日期: 
功能描述: 
其它相关: 
修改记录: 
*******************************************************************************/

// 日志文件名
var LOG_FILE_NAME = 'ProtobuffExtendHelper.js.log'

//导入protobufjs
let ProtoBuf = require("protobuf")
let protobuf = require('protobuf')

//保存原Util.fetch函数指针
let fetch = protobuf.Util.fetch;

//编写了一个myfetch函数，覆盖protobuf.Util.fetch变量
protobuf.Util.fetch = function myfetch(path, callbcak) {    
    //检查是否为原生环境    
    if (cc.sys.isNative) {       
       //原生环境直接使用jsb提供的文件操作函数加载proto内容       
       let str = jsb.fileUtils.getStringFromFile(path);       
       //如果是异步回调方式，使用callback参数返回数据       
       if (callbcak) {
           callbcak(str);           
           return null;
       }       
       //同步方式用返回值返回数据       
       return str;
    } 
    
    if(cc.sys.platform === cc.sys.WECHAT_GAME){
        
        cc.log("微信小游戏直接跳过")
        return ""
    } else {
        //为web环境使用，protobufjs原来的处理函数    
        return fetch.call(this, path, callbcak);    
    }
};

function propagateSyntax(parent) {    
    if (parent['messages']) {
        parent['messages'].forEach(function(child) {
            child["syntax"] = parent["syntax"];
            propagateSyntax(child);
        });    
    }    

    if (parent['enums']) {
        parent['enums'].forEach(function(child) {
            child["syntax"] = parent["syntax"];
        });    
    }
}

protobuf.Builder.prototype['import'] = function(json, filename) {
    var delim = '/';

    // Make sure to skip duplicate imports

    if (typeof filename === 'string') {
    	/************* 手动屏蔽
        if (ProtoBuf.Util.IS_NODE)
            filename = require("path")['resolve'](filename);
        */
        if (this.files[filename] === true)
            return this.reset();
        this.files[filename] = true;

    } else if (typeof filename === 'object') { // Object with root, file.

        var root = filename.root;
        /************* 手动屏蔽
        if (ProtoBuf.Util.IS_NODE)
            root = require("path")['resolve'](root);
        */
        if (root.indexOf("\\") >= 0 || filename.file.indexOf("\\") >= 0)
            delim = '\\';
        var fname = root + delim + filename.file;
        if (this.files[fname] === true)
            return this.reset();
        this.files[fname] = true;
    }

    // Import imports

    if (json['imports'] && json['imports'].length > 0) {
        var importRoot,
            resetRoot = false;

        if (typeof filename === 'object') { // If an import root is specified, override

            this.importRoot = filename["root"]; resetRoot = true; // ... and reset afterwards
            importRoot = this.importRoot;
            filename = filename["file"];
            if (importRoot.indexOf("\\") >= 0 || filename.indexOf("\\") >= 0)
                delim = '\\';

        } else if (typeof filename === 'string') {

            if (this.importRoot) // If import root is overridden, use it
                importRoot = this.importRoot;
            else { // Otherwise compute from filename
                if (filename.indexOf("/") >= 0) { // Unix
                    importRoot = filename.replace(/\/[^\/]*$/, "");
                    if (/* /file.proto */ importRoot === "")
                        importRoot = "/";
                } else if (filename.indexOf("\\") >= 0) { // Windows
                    importRoot = filename.replace(/\\[^\\]*$/, "");
                    delim = '\\';
                } else
                    importRoot = ".";
            }

        } else
            importRoot = null;

        for (var i=0; i<json['imports'].length; i++) {
            if (typeof json['imports'][i] === 'string') { // Import file
                if (!importRoot)
                    throw Error("cannot determine import root");
                var importFilename = json['imports'][i];
                if (importFilename === "google/protobuf/descriptor.proto")
                    continue; // Not needed and therefore not used
                /*
                if(cc.sys.platform === cc.sys.WECHAT_GAME){
                    var self = this
                    importFilename = "Proto" + delim + importFilename
                    var _callback = function(_contents){
                        if (_contents === null)
                            throw Error("failed to import '"+importFilename+"' in '"+filename+"': file not found");
                        if (/\.json$/i.test(importFilename)) // Always possible
                            self["import"](JSON.parse(_contents+""), importFilename); // May throw
                        else
                            self["import"](ProtoBuf.DotProto.Parser.parse(_contents), importFilename); // May throw
                    }

                    var contents = ProtoBuf.Util.fetch(importFilename, _callback);
                } else {*/ 

                    importFilename = importRoot + delim + importFilename;
                    if (this.files[importFilename] === true)
                        continue; // Already imported
                    if (/\.proto$/i.test(importFilename) && !ProtoBuf.DotProto)       // If this is a light build
                        importFilename = importFilename.replace(/\.proto$/, ".json"); // always load the JSON file
                    var contents = ProtoBuf.Util.fetch(importFilename);
                    if (contents === null)
                        throw Error("failed to import '"+importFilename+"' in '"+filename+"': file not found");
                    if (/\.json$/i.test(importFilename)) // Always possible
                        this["import"](JSON.parse(contents+""), importFilename); // May throw
                    else
                        this["import"](ProtoBuf.DotProto.Parser.parse(contents), importFilename); // May throw 
                //}

            } else // Import structure
                if (!filename)
                    this["import"](json['imports'][i]);
                else if (/\.(\w+)$/.test(filename)) // With extension: Append _importN to the name portion to make it unique
                    this["import"](json['imports'][i], filename.replace(/^(.+)\.(\w+)$/, function($0, $1, $2) { return $1+"_import"+i+"."+$2; }));
                else // Without extension: Append _importN to make it unique
                    this["import"](json['imports'][i], filename+"_import"+i);
        }
        if (resetRoot) // Reset import root override when all imports are done
            this.importRoot = null;
    }

    // Import structures

    if (json['package'])
        this.define(json['package']);
    if (json['syntax'])
        propagateSyntax(json);
    var base = this.ptr;
    if (json['options'])
        Object.keys(json['options']).forEach(function(key) {
            base.options[key] = json['options'][key];
        });
    if (json['messages'])
        this.create(json['messages']),
        this.ptr = base;
    if (json['enums'])
        this.create(json['enums']),
        this.ptr = base;
    if (json['services'])
        this.create(json['services']),
        this.ptr = base;
    if (json['extends'])
        this.create(json['extends']);

    return this.reset();
};
