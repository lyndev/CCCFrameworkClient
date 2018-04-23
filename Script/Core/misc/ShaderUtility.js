/*******************************************************************************
Copyright (C), 2015-2019, RaTo Tech. Co., Ltd.
文 件 名: ShaderUtility.js
作    者: 刘伏波
创建日期: 2017-12-26
完成日期: 
功能描述: 
其它相关: 
修改记录: 
*******************************************************************************/

// 日志文件名
var LOG_FILE_NAME = 'ShaderUtility.js.log'
var grayShader = {
	vShader: "attribute vec4 a_position;attribute vec2 a_texCoord; \nattribute vec4 a_color; \nvarying vec4 v_fragmentColor;\nvarying vec2 v_texCoord;\nvoid main() \n{ \ngl_Position = CC_PMatrix * a_position;\nv_fragmentColor = a_color;\nv_texCoord = a_texCoord;\n}",
	fShader: "varying vec4 v_fragmentColor; \nvarying vec2 v_texCoord; \n//uniform sampler2D CC_Texture0; \nvoid main() \n{ \nvec4 v_orColor = v_fragmentColor * texture2D(CC_Texture0, v_texCoord);\nfloat gray = dot(v_orColor.rgb, vec3(0.299, 0.587, 0.114));\ngl_FragColor = vec4(gray, gray, gray, v_orColor.a);\n}"
}

var highLightShader = {
	vShader: "attribute vec4 a_position; \nattribute vec2 a_texCoord; \nattribute vec4 a_color; \nvarying vec4 v_fragmentColor;\nvarying vec2 v_texCoord;\nvoid main() \n{ \ngl_Position = CC_PMatrix * a_position;\nv_fragmentColor = a_color;\nv_texCoord = a_texCoord;\n}",
	fShader: "varying vec4 v_fragmentColor; \nvarying vec2 v_texCoord; \n//uniform sampler2D CC_Texture0; \nvoid main() \n{ \nvec4 v_orColor = v_fragmentColor * texture2D(CC_Texture0, v_texCoord);\nfloat gray = dot(v_orColor.rgb, vec3(0.8, 0.9, 0.85));\ngl_FragColor = vec4(v_orColor.r+0.08, v_orColor.g+0.08, v_orColor.b+0.08, v_orColor.a+0.015);\n}"
}

var normalShader = {
	vShader: "attribute vec4 a_position; \nattribute vec2 a_texCoord; \nattribute vec4 a_color; \nvarying vec4 v_fragmentColor;\nvarying vec2 v_texCoord;\nvoid main() \n{ \ngl_Position = CC_PMatrix * a_position;\nv_fragmentColor = a_color;\nv_texCoord = a_texCoord;\n}",
	fShader: "varying vec4 v_fragmentColor; \nvarying vec2 v_texCoord; \n//uniform sampler2D CC_Texture0; \nvoid main() \n{ \nvec4 v_orColor = v_fragmentColor * texture2D(CC_Texture0, v_texCoord);\nfloat gray = dot(v_orColor.rgb, vec3(0.8, 0.9, 0.85));\ngl_FragColor = vec4(v_orColor.r, v_orColor.g, v_orColor.b, v_orColor.a);\n}"
}

cc.Class({
    extends: cc.Component,
	normalColorNode:function(node){
		var program = new cc.GLProgram()
		program.initWithString(normalShader.vShader, normalShader.fShader)
		program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION)
		program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR)
		program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS)
		program.link()
		program.updateUniforms()
		node._sgNode.shaderProgram = program
	},

	grayColorNode:function(node){
		var program = new cc.GLProgram()
		program.initWithString(grayShader.vShader, grayShader.fShader)
		program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION)
		program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR)
		program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS)
		program.link()
		program.updateUniforms()
		node._sgNode.shaderProgram = program
	},
	
	highlightColorNode:function(node){
		var program = new cc.GLProgram()
		program.initWithString(highLightShader.vShader, highLightShader.fShader)
		program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION)
		program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR)
		program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS)
		program.link()
		program.updateUniforms()
		node._sgNode.shaderProgram = program
	},
})