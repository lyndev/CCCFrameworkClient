/*******************************************************************************
Copyright (C), 2015-2019, RaTo Tech. Co., Ltd.
文 件 名: CardHelper.js
作    者: 刘伏波
创建日期: 2018-04-11
完成日期: 
功能描述: 
其它相关: 
修改记录: 
*******************************************************************************/

// 日志文件名
var LOG_FILE_NAME = 'CardHelper.js.log'

var CARD_VALUE = {}
var CARD_PNG_PATH = "game_main/Texture/ui/main/card/"

// 方块 A - K
CARD_VALUE[0x01] = { name : "方块A", foreTemplate : "fangkuai_num", numTemplate :   "pred_14",  num : 1 }
CARD_VALUE[0x02] = { name : "方块2", foreTemplate : "fangkuai_num", numTemplate :   "pred_2",   num : 2 }
CARD_VALUE[0x03] = { name : "方块3", foreTemplate : "fangkuai_num", numTemplate :   "pred_3",   num : 3 }
CARD_VALUE[0x04] = { name : "方块4", foreTemplate : "fangkuai_num", numTemplate :   "pred_4",   num : 4 }
CARD_VALUE[0x05] = { name : "方块5", foreTemplate : "fangkuai_num", numTemplate :   "pred_5",   num : 5 }
CARD_VALUE[0x06] = { name : "方块6", foreTemplate : "fangkuai_num", numTemplate :   "pred_6",   num : 6 }
CARD_VALUE[0x07] = { name : "方块7", foreTemplate : "fangkuai_num", numTemplate :   "pred_7",   num : 7 }
CARD_VALUE[0x08] = { name : "方块8", foreTemplate : "fangkuai_num", numTemplate :   "pred_8",   num : 8 }
CARD_VALUE[0x09] = { name : "方块9", foreTemplate : "fangkuai_num", numTemplate :   "pred_9",   num : 9 }
CARD_VALUE[0x0A] = { name : "方块10",foreTemplate : "fangkuai_num", numTemplate :   "pred_10",  num : 10 }
CARD_VALUE[0x0B] = { name : "方块J", foreTemplate : "fangkuai_j",   numTemplate :   	"pred_11",  num : 11 }
CARD_VALUE[0x0C] = { name : "方块Q", foreTemplate : "fangkuai_q",   numTemplate :   	"pred_12",  num : 12 }
CARD_VALUE[0x0D] = { name : "方块K", foreTemplate : "fangkuai_k",   numTemplate :   	"pred_13",  num : 13 }

// 梅花 A - K
CARD_VALUE[0x11] = { name : "梅花A", foreTemplate : "meihua_num",   numTemplate :   "pblack_14",  num : 1  }
CARD_VALUE[0x12] = { name : "梅花2", foreTemplate : "meihua_num",   numTemplate :   "pblack_2",   num : 2  }
CARD_VALUE[0x13] = { name : "梅花3", foreTemplate : "meihua_num",   numTemplate :   "pblack_3",   num : 3  }
CARD_VALUE[0x14] = { name : "梅花4", foreTemplate : "meihua_num",   numTemplate :   "pblack_4",   num : 4  }
CARD_VALUE[0x15] = { name : "梅花5", foreTemplate : "meihua_num",   numTemplate :   "pblack_5",   num : 5  }
CARD_VALUE[0x16] = { name : "梅花6", foreTemplate : "meihua_num",   numTemplate :   "pblack_6",   num : 6  }
CARD_VALUE[0x17] = { name : "梅花7", foreTemplate : "meihua_num",   numTemplate :   "pblack_7",   num : 7  }
CARD_VALUE[0x18] = { name : "梅花8", foreTemplate : "meihua_num",   numTemplate :   "pblack_8",   num : 8  }
CARD_VALUE[0x19] = { name : "梅花9", foreTemplate : "meihua_num",   numTemplate :   "pblack_9",   num : 9  }
CARD_VALUE[0x1A] = { name : "梅花10",foreTemplate : "meihua_num",   numTemplate :   "pblack_10",  num : 10 }
CARD_VALUE[0x1B] = { name : "梅花J", foreTemplate : "meihua_j",     numTemplate :   "pblack_11",  num : 11 }
CARD_VALUE[0x1C] = { name : "梅花Q", foreTemplate : "meihua_q",     numTemplate :   "pblack_12",  num : 12 }
CARD_VALUE[0x1D] = { name : "梅花K", foreTemplate : "meihua_k",     numTemplate :   "pblack_13",  num : 13 }  

// 红桃 A - K
CARD_VALUE[0x21] = { name : "红桃A", foreTemplate : "hongtao_num",  numTemplate : "pred_14",  num : 1  }
CARD_VALUE[0x22] = { name : "红桃2", foreTemplate : "hongtao_num",  numTemplate : "pred_2",   num : 2  }
CARD_VALUE[0x23] = { name : "红桃3", foreTemplate : "hongtao_num",  numTemplate : "pred_3",   num : 3  }
CARD_VALUE[0x24] = { name : "红桃4", foreTemplate : "hongtao_num",  numTemplate : "pred_4",   num : 4  }
CARD_VALUE[0x25] = { name : "红桃5", foreTemplate : "hongtao_num",  numTemplate : "pred_5",   num : 5  }
CARD_VALUE[0x26] = { name : "红桃6", foreTemplate : "hongtao_num",  numTemplate : "pred_6",   num : 6  }
CARD_VALUE[0x27] = { name : "红桃7", foreTemplate : "hongtao_num",  numTemplate : "pred_7",   num : 7  }
CARD_VALUE[0x28] = { name : "红桃8", foreTemplate : "hongtao_num",  numTemplate : "pred_8",   num : 8  }
CARD_VALUE[0x29] = { name : "红桃9", foreTemplate : "hongtao_num",  numTemplate : "pred_9",   num : 9  }
CARD_VALUE[0x2A] = { name : "红桃10",foreTemplate : "hongtao_num",  numTemplate : "pred_10",  num : 10 }
CARD_VALUE[0x2B] = { name : "红桃J", foreTemplate : "hongtao_j",  	numTemplate : "pred_11",  num : 11 }
CARD_VALUE[0x2C] = { name : "红桃Q", foreTemplate : "hongtao_q",  	numTemplate : "pred_12",  num : 12 }
CARD_VALUE[0x2D] = { name : "红桃K", foreTemplate : "hongtao_k",  	numTemplate : "pred_13",  num : 13 } 

// 黑桃 A - K
CARD_VALUE[0x31] = { name : "黑桃A",  foreTemplate : "heitao_num",  numTemplate : "pblack_14",  num : 1  }
CARD_VALUE[0x32] = { name : "黑桃2",  foreTemplate : "heitao_num",  numTemplate : "pblack_2",   num : 2  }
CARD_VALUE[0x33] = { name : "黑桃3",  foreTemplate : "heitao_num",  numTemplate : "pblack_3",   num : 3  }
CARD_VALUE[0x34] = { name : "黑桃4",  foreTemplate : "heitao_num",  numTemplate : "pblack_4",   num : 4  }
CARD_VALUE[0x35] = { name : "黑桃5",  foreTemplate : "heitao_num",  numTemplate : "pblack_5",   num : 5  }
CARD_VALUE[0x36] = { name : "黑桃6",  foreTemplate : "heitao_num",  numTemplate : "pblack_6",   num : 6  }
CARD_VALUE[0x37] = { name : "黑桃7",  foreTemplate : "heitao_num",  numTemplate : "pblack_7",   num : 7  }
CARD_VALUE[0x38] = { name : "黑桃8",  foreTemplate : "heitao_num",  numTemplate : "pblack_8",   num : 8  }
CARD_VALUE[0x39] = { name : "黑桃9",  foreTemplate : "heitao_num",  numTemplate : "pblack_9",   num : 9  }
CARD_VALUE[0x3A] = { name : "黑桃10", foreTemplate : "heitao_num",  numTemplate : "pblack_10",  num : 10 }
CARD_VALUE[0x3B] = { name : "黑桃J",  foreTemplate : "heitao_j",    numTemplate : "pblack_11",  num : 11 }
CARD_VALUE[0x3C] = { name : "黑桃Q",  foreTemplate : "heitao_q",    numTemplate : "pblack_12",  num : 12 }
CARD_VALUE[0x3D] = { name : "黑桃K",  foreTemplate : "heitao_k",    numTemplate : "pblack_13",  num : 13 } 

var CardHelper = cc.Class({
	getCardValue:function(str_value){
		var _hex_value = Number(str_value)
        if(!CARD_VALUE[_hex_value]){
            cc.log("牌值错误:", str_value)
        }
		return CARD_VALUE[_hex_value]
	},

    getCardNumPath:function(str_value){
        var _val = this.getCardValue(str_value)
        var _path = CARD_PNG_PATH + _val.numTemplate
        return _path
    },

    getCardForePath:function(str_value){
        var _val = this.getCardValue(str_value)
        var _path = CARD_PNG_PATH + _val.foreTemplate
        return _path
    },

    sortCard:function(cards){
        if(cards){
            var _v1 = 0
            for(var i = 0; i < cards.length-1; i++){
               for(var j = cards.length-1; j > i; j--){

                    if(cc.Client.Utility.getHexNumber(cards[j]) < cc.Client.Utility.getHexNumber(cards[j - 1])){
                        _v1 = cards[j]
                        cards[j] = cards[j - 1]
                        cards[j - 1] = _v1
                    }
               } 
            }
            return cards
        }
        return null
    },

})