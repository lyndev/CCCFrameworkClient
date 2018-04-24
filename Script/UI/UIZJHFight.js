/*******************************************************************************
Copyright (C), 2015-2019, XXX Tech. Co., Ltd.
文 件 名: UIZJHFight.js
作    者: lyn
创建日期: 2018-03-28
完成日期: 
功能描述: 
其它相关: 
修改记录: 
*******************************************************************************/

// 日志文件名
var LOG_FILE_NAME = 'UIZJHFight.js.log'

var UIBase = require("UIBase")
var FULL_PEOPLE_COUNT  = 7
var THINKING_TIME = 61     
var CLEAR_DESK = 3     
var TOTAL_PLAY_TIMES = 20
var CARD_DEFAULT_POINT = []
CARD_DEFAULT_POINT[0]  = cc.p(-30, 0)
CARD_DEFAULT_POINT[1]  = cc.p(0, 0)
CARD_DEFAULT_POINT[2]  = cc.p(30, 0)

cc.Class({
    extends: UIBase,
    properties: {
        btnReturn:cc.Node,
        playerHead:{default:[], type: cc.Node},
        playerMount:{default:[], type: cc.Node},
        nodeTimer:cc.Node,
        txtRemainTime:cc.Label,
        txtRoomNumber:cc.Label,
        remianTime:0,
        chipNode:cc.Node,
        nodeFollowForever:cc.Node,
        bFollowForever:false,
        chipTestPrefab:cc.Prefab,
        sendCardNode:cc.Node,
        sendCardMountNode:cc.Node,
        btnListNode:cc.Node,

        btnBlackMask:cc.Node,
        btnLookCard:cc.Node,
        btnGiveupCard:cc.Node,
        btnCompareCard:cc.Node,
        btnFollowChip:cc.Node,
        btnAddChip:cc.Node,
        btnFollowChipForever:cc.Node,

        btnReady:cc.Node,
        btnSwitch:cc.Node,
        btnCancel:cc.Node,

        btnExit:cc.Node,

        txtCellScore:cc.Label,
        txtTotalScore:cc.Label,
        txtPlayTimes:cc.Label,

    }, 

    onLoad:function(){
        cc.Client.UIStackManager.pushUI(this.__classname__, cc.Client.GameType.UIActionType.Hide)
        var self = this
        globalEvent.on("event_wechat_head_image", function(event){
                self.eventSetPlayerHeadImage(event)
        }, this)
        
        if(this.btnReturn) cc.Client.UIHelper.AddClickEvent(this.btnReturn, this.node, "btnClickHandler", this.__classname__)
        if(this.btnLookCard) cc.Client.UIHelper.AddClickEvent(this.btnLookCard, this.node, "btnClickHandler", this.__classname__)
        if(this.btnGiveupCard) cc.Client.UIHelper.AddClickEvent(this.btnGiveupCard, this.node, "btnClickHandler", this.__classname__)
        if(this.btnCompareCard) cc.Client.UIHelper.AddClickEvent(this.btnCompareCard, this.node, "btnClickHandler", this.__classname__)
        if(this.btnFollowChip) cc.Client.UIHelper.AddClickEvent(this.btnFollowChip, this.node, "btnClickHandler", this.__classname__)
        if(this.btnAddChip) cc.Client.UIHelper.AddClickEvent(this.btnAddChip, this.node, "btnClickHandler", this.__classname__)
        if(this.btnFollowChipForever) cc.Client.UIHelper.AddClickEvent(this.btnFollowChipForever, this.node, "btnClickHandler", this.__classname__)
        if(this.btnBlackMask) cc.Client.UIHelper.AddClickEvent(this.btnBlackMask, this.node, "btnClickHandler", this.__classname__)

        if(this.btnReady) cc.Client.UIHelper.AddClickEvent(this.btnReady, this.node, "btnClickHandler", this.__classname__)
        if(this.btnSwitch) cc.Client.UIHelper.AddClickEvent(this.btnSwitch, this.node, "btnClickHandler", this.__classname__)
        if(this.btnCancel) cc.Client.UIHelper.AddClickEvent(this.btnCancel, this.node, "btnClickHandler", this.__classname__)
        if(this.btnExit) cc.Client.UIHelper.AddClickEvent(this.btnExit, this.node, "btnClickHandler", this.__classname__)
    },

    init:function(msg){
        this.clearDesk()

        var self = this
        this.m_locationMapUIIndex = []
        this.m_playerUIIndex = 0
        this.m_cardIndex = 0
        this.m_chips = []
        this.m_thinkingLocation = -1
        this.grayActionBtns(false)

        for (var i = 0; i < FULL_PEOPLE_COUNT; i++) {
            this.m_locationMapUIIndex[i] = -1
        }

        cc.Client.MessageManager.register(this, cc.GameMsg.MSGID.SC_ROOM_RESACTION, function(msg_id, msg_data){
            self.onActionMsgHandler(msg_data)
        })

        cc.Client.MessageManager.register(this, cc.GameMsg.MSGID.SC_ROOM_RESGAMESTARTFIGHTDATA, function(msg_id, msg_data){
            self.onGameStartMsgHandler(msg_data)
        })
        
        cc.Client.MessageManager.register(this, cc.GameMsg.MSGID.SC_ROOM_RESFIGHTRESULT, function(msg_id, msg_data){
            self.onGameResultMsgHandler(msg_data)
        })

        globalEvent.on('player_leave', function(event){ 
             var _user_data = event.getUserData()
             var _location = _user_data.location
             self.onPlayerLeaveEvent(_location)
        }, this)

        globalEvent.on('player_enter', function(event){ 
             var _user_data = event.getUserData()
             var _location = _user_data.location
             self.onPlayerEnterEvent(_location)
        }, this)

        var _data = msg.data
        this.setRoomInfo(_data.roomInfo)

        var _locations = gFightMgr.getPlayerLocations()
        for (var i = 0; i < _locations.length; i++) {
            if(_locations[i] != ""){
                this.onPlayerEnterEvent(i)        
            }
        }
            
    },

    update:function(dt){
        if(this.m_playerTimerFrame && this.m_playerTimerFrame.active){
            if(this.remianTime > 0 ){
                this.remianTime = this.remianTime - dt
            }

            if(this.remianTime > 0){
                this.m_playerTimerFrame.getComponent(cc.Sprite).fillRange = this.remianTime / THINKING_TIME
            }

            if(this.remianTime < 0){
                this.m_playerTimerFrame.active = false
            }
        }
    },

    clearDesk:function(){
        for (var i = 0; i < FULL_PEOPLE_COUNT; i++) {
            this.changeReadyShow(i, false)
            this.showCardState(i,"reset")
            this.resetPlayerCard(i)
        }
        this.btnPlayerReadyHandler("unready")
        if(this.chipNode) this.chipNode.removeAllChildren()
    },

    onGameStartMsgHandler:function(msg_data){
        this.btnPlayerReadyHandler("hideall")
        for (var i = 0; i < FULL_PEOPLE_COUNT; i++) {
            this.changeReadyShow(i, false)
        }       

        this.m_playerUIIndex = 0
        this.m_cardIndex = 0
        this.playSendCardAnimation()
    },

    onGameResultMsgHandler:function(msg_data){
        var self = this
        var _chipsPlayCallback = function(){
            self.clearDesk()
        }
        if(!msg_data){
            cc.error("not msg_data")
            return
        }

        if(!msg_data.zjh_gameResult){
            cc.error("not msg_data.zjh_gameResult")
            return
        }

        this.playChipsForWinner(msg_data.zjh_gameResult.winnerLocation, _chipsPlayCallback)
        this.showAllPlayerHandCard(msg_data.zjh_gameResult.playerCard)

        if(this.m_playerTimerFrame){
            this.m_playerTimerFrame.active = false
            this.m_playerTimerFrame.getComponent(cc.Sprite).fillRange = 1
        }
    },

    onActionMsgHandler:function(msg_data){
        if(!msg_data){
            cc.log("onActionMsgHandler msg_data error")
            return
        }

        var _action_data = msg_data.action
        if(!_action_data){
            cc.log("onActionMsgHandler msg_data.action error", _action_data)
            return
        }
        var _action_type = _action_data.actionType
        var _role_id = _action_data.playerId
        var _location = gFightMgr.getPlayerIndex(_role_id)
        var isSelf = function(){
            return _role_id == cc.Client.PlayerManager.getRoleId()
        }

        switch(_action_type){
            case cc.Client.GameType.FightActionType.A_READY:
                if(isSelf()){
                    this.btnPlayerReadyHandler("ready")
                }
                this.changeReadyShow(_location, true)
                gFightMgr.setReady(_location, true)
                break
            case cc.Client.GameType.FightActionType.A_UNREADY:
                if(isSelf()){
                    this.btnPlayerReadyHandler("unready")
                }
                this.changeReadyShow(_location, false)
                gFightMgr.setReady(_location, false)
                break
            case cc.Client.GameType.FightActionType.A_ROBOT:

                break
            case cc.Client.GameType.FightActionType.A_UNROBOT:

                break
            case cc.Client.GameType.FightActionType.A_WAIT:

                break
            case cc.Client.GameType.FightActionType.A_UNWAIT:

                break
            case cc.Client.GameType.FightActionType.A_GIVE_UP:
                this.giveupCardHandler(_location)
                break
            case cc.Client.GameType.FightActionType.A_LOOK_CARD:
                var _lookcard = _action_data.zjh_lookcard
                var _cards = null
                if(_lookcard){
                    _cards = _lookcard.cards
                }
                this.playLookCardAction(_location, _cards)
                break
            case cc.Client.GameType.FightActionType.A_OPEN_CARD:

                break
            case cc.Client.GameType.FightActionType.A_COMPARE_CARD:

                break
            case cc.Client.GameType.FightActionType.A_ADD_SCORE:
                break
            case cc.Client.GameType.FightActionType.A_FOLLOW_SCORE:
                if(!msg_data.zjh_addScore){
                    cc.log("msg_data.zjh_addScore is null")
                }
                this.updateDeskScore(msg_data.zjh_addScore)
                cc.log("玩家继续跟注或加注index:%d, score:%d", _location, msg_data.zjh_addScore)
                this.addOneChips(_location, 100)
                break
            case cc.Client.GameType.FightActionType.A_WAIT_COMPARE:

                break
            case cc.Client.GameType.FightActionType.A_THINKING:
                this.thingkingHandler(_location)
                break
            case cc.Client.GameType.FightActionType.A_ONLINE:

                break
            case cc.Client.GameType.FightActionType.A_OFFLINE:

                break
        }
    },

    btnClickHandler:function(event){
        var _btn_name = event.target.name
        switch(_btn_name){
            case "btn_look_card":
                if(!this.isSelfThinking()){
                    return
                }
                this.sendActionMsg(cc.Client.GameType.FightActionType.A_LOOK_CARD)
                break
            case "btn_give_up_card":
                if(!this.isSelfThinking()){
                    return
                }
                this.sendActionMsg(cc.Client.GameType.FightActionType.A_GIVE_UP)
                break
            case "btn_compare_card":
                if(!this.isSelfThinking()){
                    return
                }
                this.compareCardHandler()
                break
            case "btn_follow_chip":
                if(!this.isSelfThinking()){
                    return
                }
                this.sendActionMsg(cc.Client.GameType.FightActionType.A_FOLLOW_SCORE)

                break
            case "btn_add_chip":
                if(!this.isSelfThinking()){
                    return
                }
                var _msg = cc.Client.MessageUtility.getMsgStruct(cc.GameMsg.MSGID.CS_ROOM_REQACTION)
                var _action = {}
                _action.actionType = cc.Client.GameType.FightActionType.A_ADD_SCORE
                _action.playerId = cc.Client.PlayerManager.getRoleId()
                var _zjh_addScore = {}
                _zjh_addScore.addScoreCount = 500
                _action.zjh_addScore = _zjh_addScore
                _msg.actions = _action
                cc.Client.GameWebsocket.sendToServer(cc.GameMsg.MSGID.CS_ROOM_REQACTION, _msg)

                break
            case "btn_follow_chip_forever":
                if(!this.isSelfThinking()){
                    return
                }
                this.followChipForeverHandler()
                
                var _msg = cc.Client.MessageUtility.getMsgStruct(cc.GameMsg.MSGID.CS_ROOM_REQACTION)
                var _action = {}
                _action.actionType = cc.Client.GameType.FightActionType.A_FOLLOW_SCORE_FOREVER
                _action.playerId = cc.Client.PlayerManager.getRoleId()
                _action.zjh_followForever = this.bFollowForever
                _msg.actions = _action
                cc.Client.GameWebsocket.sendToServer(cc.GameMsg.MSGID.CS_ROOM_REQACTION, _msg)
                break
            case "btn_show_list":
                this.btnListShowHandler()
                break
            case "btn_black_mask":
                this.btnListShowHandler()
                break
            case "btn_switch":
                cc.log("请求换桌")
                break
            case "btn_ready":
                this.btnPlayerReadyHandler("ready")
                this.sendActionMsg(cc.Client.GameType.FightActionType.A_READY)
                break
            case "btn_cancel":
                this.btnPlayerReadyHandler("unready")
                this.sendActionMsg(cc.Client.GameType.FightActionType.A_UNREADY)
                break
            case "btn_exit":
                var _msg = cc.Client.MessageUtility.getMsgStruct(cc.GameMsg.MSGID.CS_ROOM_REQLEAVEROOM)
                var _room_info = {}
                var _room_info = gFightMgr.getRoomInfo()
                _msg.roomInfo = _room_info
                cc.Client.GameWebsocket.sendToServer(cc.GameMsg.MSGID.CS_ROOM_REQLEAVEROOM, _msg)
                break
        }
    },

    sendActionMsg:function(action_type){
        var _msg = cc.Client.MessageUtility.getMsgStruct(cc.GameMsg.MSGID.CS_ROOM_REQACTION)
        var _action = {}
        _action.actionType = action_type
        _action.playerId = cc.Client.PlayerManager.getRoleId()
        _msg.actions = _action
        cc.Client.GameWebsocket.sendToServer(cc.GameMsg.MSGID.CS_ROOM_REQACTION, _msg)
    },

    onPlayerLeaveEvent:function(location){
        var _ui_index = this.getUIRelativeIndex(location)
        cc.log("事件-玩家离开房间location, ui_index", location, _ui_index)
        if(_ui_index == 0){
            var _msg = {}
            _msg.name = "UIZJHFight"
            cc.Client.UIManager.closeUI(_msg)
            gFightMgr.onDestroy()
            gFightMgr = null
        } else {
            this.playPlayerLeaveCardAnimation(location)
            this.m_locationMapUIIndex[_ui_index] = -1
            this.playerHead[_ui_index].active = false
            this.playerMount[_ui_index].active = false
        }      
    },

    onPlayerEnterEvent:function(location){
        var _ui_index = this.getUIRelativeIndex(location)
        this.m_locationMapUIIndex[_ui_index] = location
        this.playerHead[_ui_index].active = true
        this.playerMount[_ui_index].active = true
        var _playerInfo = gFightMgr.getPlayerInfoByLocation(location)
        this.setPlayerInfo(_playerInfo)
        var _bReady = gFightMgr.isReady(location)
        this.changeReadyShow(location, _bReady)
        
        // 自己需要显示操作按钮
        if(_ui_index == 0){
            if(_bReady){
                this.btnPlayerReadyHandler("ready")
            } else {
                this.btnPlayerReadyHandler("unready")
            }
        }
        cc.log("事件-玩家进入房间", location, _bReady)
    },

    getLocationByUIIndex:function(ui_index){
        return this.m_locationMapUIIndex[ui_index]
    },

    updateDeskScore:function(data){
        if(data){
            if(this.txtPlayTimes) this.txtPlayTimes.string = data.currentPlayTimes + "/" +TOTAL_PLAY_TIMES
            var _totalScore = cc.Client.Utility.FormatMoney(data.currentTotalScore)
            var _cellScore = cc.Client.Utility.FormatMoney(data.currentCellScore)
            if(this.txtTotalScore) this.txtTotalScore.string = _totalScore
            if(this.txtCellScore) this.txtCellScore.string = _cellScore
        }
    },

    changeReadyShow:function(location, bReady){
        var _ui_index = this.getUIRelativeIndex(location)
        var _playerMountNode = this.playerMount[_ui_index]
        var _sp_ready_node = cc.Client.UIHelper.FindNodeByName(_playerMountNode, "sp_ready_flag")
        cc.log("ready change ", _playerMountNode.name)
        if(_sp_ready_node){
                _sp_ready_node.active = bReady
        } else{
                cc.log("not find the sp_ready_flag sprite.")
        }
    },  

    btnListShowHandler:function(){
        if(this.btnListNode){
            this.btnListNode.active = !this.btnListNode.active
        }
        if(this.btnBlackMask){
            this.btnBlackMask.active = !this.btnBlackMask.active
        } 
    },

    btnPlayerReadyHandler:function(type){
        if(type == "hideall"){
            if(this.btnReady){
                this.btnReady.active = false
            }
            if(this.btnSwitch){
                this.btnSwitch.active = false
            }
            if(this.btnCancel){
                this.btnCancel.active = false
            }
        } else if(type == 'unready'){
            if(this.btnReady){
                this.btnReady.active = true
            }
            if(this.btnSwitch){
                this.btnSwitch.active = true
            }
            if(this.btnCancel){
                this.btnCancel.active = false
            }
        } else if(type == 'ready'){
            if(this.btnReady){
                this.btnReady.active = false
            }
            if(this.btnSwitch){
                this.btnSwitch.active = false
            }
            if(this.btnCancel){
                this.btnCancel.active = true
            }
        }
    },

    lookCardHandler:function(look_card_location, cards){
    },

    giveupCardHandler:function(location) {
        this.playGiveupGrayCard(location)
    },

    thingkingHandler:function(location){
        this.m_thinkingLocation = location
/*        if(this.isSelfThinking()){
            this.grayActionBtns(false)
        } else {
            this.grayActionBtns(true)
        }*/
        var _ui_index = this.getUIRelativeIndex(location)
        this.cdTimer(_ui_index)
    },

    grayActionBtns:function(bGray){
        if(this.btnLookCard){
            if(bGray){
                cc.Client.UIHelper.GrayNode(this.btnLookCard)
            } else {
                cc.Client.UIHelper.ResetGrayNode(this.btnLookCard)
            }
        }
        if(this.btnGiveupCard){

            if(bGray){
                cc.Client.UIHelper.GrayNode(this.btnGiveupCard)
            } else {
                cc.Client.UIHelper.ResetGrayNode(this.btnGiveupCard)
            }
        }
        if(this.btnCompareCard){

            if(bGray){
                cc.Client.UIHelper.GrayNode(this.btnCompareCard)
            } else {
                cc.Client.UIHelper.ResetGrayNode(this.btnCompareCard)
            }
        }
        if(this.btnFollowChip){

            if(bGray){
                cc.Client.UIHelper.GrayNode(this.btnFollowChip)
            } else {
                cc.Client.UIHelper.ResetGrayNode(this.btnFollowChip)
            }
        }
        if(this.btnAddChip){

            if(bGray){
                cc.Client.UIHelper.GrayNode(this.btnAddChip)
            } else {
                cc.Client.UIHelper.ResetGrayNode(this.btnAddChip)
            }
        }
        if(this.btnFollowChipForever){
            if(bGray){
                cc.Client.UIHelper.GrayNode(this.btnFollowChipForever)
            } else {
                cc.Client.UIHelper.ResetGrayNode(this.btnFollowChipForever)
            }
        }
    },

    isSelfThinking:function(){
        if(this.m_thinkingLocation < 0){
            return false
        }
        var _index = this.getUIRelativeIndex(this.m_thinkingLocation)
        if(_index == 0){
            return true
        }
    },

    followChipHandler:function(){
        
    },

    followChipForeverHandler:function(){
        this.nodeFollowForever.active = !this.nodeFollowForever.active
        this.bFollowForever = this.nodeFollowForever.active
    },

    cdTimer:function(ui_index){
        if(this.m_playerTimerFrame){
            this.m_playerTimerFrame.active = false
            this.m_playerTimerFrame.getComponent(cc.Sprite).fillRange = 1
        }
        var _playerHead = this.getPlayerHead(ui_index)
        this.remianTime = THINKING_TIME
        if(_playerHead){
            this.m_playerTimerFrame = cc.Client.UIHelper.FindNodeByName(_playerHead, "sp_timer")
            if(this.m_playerTimerFrame) this.m_playerTimerFrame.active = true
        }
  
    },

    randomChipPoint:function(m, n){
        var random = Math.floor(Math.random()*(n-m+1)+m);
        return random
    },

    addOneChips:function(ui_index, chip_value){
        var _randomX = this.randomChipPoint(-this.chipNode.width * 0.5, this.chipNode.width * 0.5)
        var _randomY = this.randomChipPoint(-this.chipNode.height * 0.5, this.chipNode.height * 0.5)
        var _chip_obj = this.instantiateChip(chip_value)
        _chip_obj.scale = 0.8
        _chip_obj.active = false
        _chip_obj.parent = this.chipNode
        var _taget_point = cc.p(_randomX, _randomY)

        var _playerHead = this.getPlayerHead(ui_index)
        if(_playerHead){
            var _pointHeadWorld = _playerHead.convertToWorldSpaceAR(cc.p(0,0))
            var _pointHeadBaseChipNode = this.chipNode.convertToNodeSpaceAR(_pointHeadWorld)
            _chip_obj.position = _pointHeadBaseChipNode
            _chip_obj.active = true
            var _moveTo = cc.moveTo(0.1, _taget_point)
            _chip_obj.runAction(_moveTo)
            this.m_chips.push(_chip_obj)
        }
    },

    showAllPlayerHandCard:function(player_cards){
        cc.log("显示所有玩家的牌值")
        if(player_cards){
            for (var i = 0; i < player_cards.length; i++) {
                var _player_card = player_cards[i]
                var _location = gFightMgr.getPlayerIndex(_player_card.playerId)
                this.showPlayerCard(_location, _player_card.cards)
            }
        }
    },

    resetPlayerCard:function(location){
        var _ui_index = this.getUIRelativeIndex(location)
        var _mount_node = this.getPlayerMount(_ui_index)
        if(_mount_node){
            var _card_node = cc.Client.UIHelper.FindNodeByName(_mount_node, "card_node")
            cc.Client.UIHelper.ResetGrayNode(_card_node)
            var _resetCard = function(index){
                var _card = cc.Client.UIHelper.FindNodeByName(_card_node, index + "")
                if(!_card) return
                _card.position = CARD_DEFAULT_POINT[index]
                _card.rotation = 0
                var _card_value = cc.Client.UIHelper.FindNodeByName(_card, "car_value")
                var _card_fore = cc.Client.UIHelper.FindNodeByName(_card, 'card_fore_bg')
                var _card_back = cc.Client.UIHelper.FindNodeByName(_card, 'card_back_bg')
                if(_card_back) _card_back.active = false
                if(_card_fore){
                    _card_fore.getComponent(cc.Sprite).spriteFrame = null
                    _card_fore.active = false
                }
                if(_card_value){
                    _card_value.getComponent(cc.Sprite).spriteFrame = null
                    _card_value.active = false
                }
            }
            _resetCard(0)
            _resetCard(1)
            _resetCard(2)
        } else {
            cc.log("not find the card node")
        }
    },

    showPlayerCard:function(location, cards){
        if(cards ==null){
            cc.log("显示手中牌错误，card is null")
            return
        }
        cc.log("显示单个玩家手中的牌值")
        var _ui_index = this.getUIRelativeIndex(location)
        var _card_node = this.getPlayerMount(_ui_index)
        var _showCard = function(index, card_value){
            var _card = cc.Client.UIHelper.FindNodeByName(_card_node, index + "")
            if(!_card) return

            _card.position = CARD_DEFAULT_POINT[index]
            _card.rotation = 0

            var _card_value = cc.Client.UIHelper.FindNodeByName(_card, "car_value")
            var _card_fore = cc.Client.UIHelper.FindNodeByName(_card, 'card_fore_bg')
            var _card_back = cc.Client.UIHelper.FindNodeByName(_card, 'card_back_bg')
            if(_card_back) _card_back.active = false

            var _fore_path = cc.Client.CardHelper.getCardForePath(card_value)
            var _num_path = cc.Client.CardHelper.getCardNumPath(card_value)

            cc.loader.loadRes(_fore_path, cc.SpriteFrame, function(err, spriteFrame){
                if(err){
                    cc.log(err)
                    return
                }

                if(_card_fore){
                    _card_fore.getComponent(cc.Sprite).spriteFrame = spriteFrame
                    _card_fore.active = true
                }
            })

            cc.loader.loadRes(_num_path, cc.SpriteFrame, function(err, spriteFrame){
                if(err){
                    cc.log(err)
                    return
                }
                if(_card_value){
                    _card_value.getComponent(cc.Sprite).spriteFrame = spriteFrame
                    _card_value.active = true
                }
            })
        }

        if(_card_node){
            cards = cc.Client.CardHelper.sortCard(cards)
            var _show = ""
            for (var i = 0; i < 3; i++) {
                var _card = cards[i]
                var _cardV = cc.Client.CardHelper.getCardValue(_card)
                _show = _show + " " + _card + ":" + _cardV.name
                _showCard(i, _card)
            }
        } else {
            cc.node("not find card_node")
        }
    },

    showCardState:function(location, show_type){
        var _ui_index = this.getUIRelativeIndex(location)
        var _mount_node = this.getPlayerMount(_ui_index)
        if(_mount_node){

            var _sp_gray         = cc.Client.UIHelper.FindNodeByName(_mount_node, "sp_gray")
            var _sp_look_card    = cc.Client.UIHelper.FindNodeByName(_mount_node, "sp_look_card")
            var _sp_give_up      = cc.Client.UIHelper.FindNodeByName(_mount_node, "sp_give_up")
            var _sp_compare_lose = cc.Client.UIHelper.FindNodeByName(_mount_node, "sp_compare_lose")

            if(_sp_look_card) _sp_look_card.active = false
            if(_sp_give_up) _sp_give_up.active = false
            if(_sp_compare_lose) _sp_compare_lose.active = false

            if(show_type == "compare_lose") _sp_compare_lose.active = true
            if(show_type == "look_card")_sp_look_card.active = true
            if(show_type == "giveup") _sp_give_up.active = true
            if(_sp_gray){
                if(show_type == "reset"){
                    _sp_gray.active = false
                } else {
                    _sp_gray.active = true
                }
            }
        }
    },

    playChipsForWinner:function(location, callback){
        var _ui_index = this.getUIRelativeIndex(location)
        if(this.m_chips.length > 0){
            var _targetHead = this.getPlayerHead(_ui_index)
            if(_targetHead){
                var _pointHeadWorld = _targetHead.convertToWorldSpaceAR(cc.p(0,0))
                var _pointHeadBaseChipNode = this.chipNode.convertToNodeSpaceAR(_pointHeadWorld)
                var self = this
                for (var i = this.m_chips.length - 1; i >= 0; i--) {
                    var _chip = this.m_chips[i]
                    var _moveTo = cc.moveTo(0.4, _pointHeadBaseChipNode)
                    var _callback = cc.callFunc(function(){
                        var _chip_obj = self.m_chips.pop()
                        _chip_obj.active = false
                        if(self.m_chips.length == 0){
                            if(callback){
                                self.scheduleOnce(callback, CLEAR_DESK);    
                            }
                        }
                    })
                    var _actions = []
                    _actions.push(_moveTo)
                    _actions.push(_callback)
                    var _sq = cc.sequence(_actions)
                    _chip.runAction(_sq)
                }
            }
        } else {
            if(callback){
                this.scheduleOnce(callback, CLEAR_DESK);    
            }
        }
    },

    playPlayerLeaveCardAnimation:function(location){
        var _ui_index = this.getUIRelativeIndex(location)
        var _mount_node = this.getPlayerMount(_ui_index)
        if(!_mount_node){
            cc.log("not find _mount_node")
            return
        }

        var _chipNodePointWorld = this.chipNode.convertToWorldSpaceAR(cc.p(0,0))
        var _chipNodePoinBaseMountNode = _mount_node.convertToNodeSpaceAR(_chipNodePointWorld)
        
        var _mountCard = cc.Client.UIHelper.FindNodeByName(_mount_node, "card_node")
        var _cardNodes = []
        var _card_node0 = cc.Client.UIHelper.FindNodeByName(_mountCard, "0")
        var _card_node1 = cc.Client.UIHelper.FindNodeByName(_mountCard, "1")
        var _card_node2 = cc.Client.UIHelper.FindNodeByName(_mountCard, "2")

        if(_card_node0)
            _cardNodes.push(_card_node0)

        if(_card_node1)
            _cardNodes.push(_card_node1)

        if(_card_node2)
            _cardNodes.push(_card_node2)

        var _resetCardNode = function(index){
            if(_cardNodes[index]){
                _cardNodes[index].position = CARD_DEFAULT_POINT[index]
                _cardNodes[index].rotation = 0
                _cardNodes[index].active = false
            }
        }

        var _callback = function(){
            _resetCardNode(0)
            _resetCardNode(1)
            _resetCardNode(2)
        }

        var _moveTo = cc.moveTo(0.3, _chipNodePoinBaseMountNode)
        var _fadeOut = cc.fadeOut(0.3)
        var _ccfunc = cc.callFunc(_callback)
        var _actions = []
        var _spawnActions = cc.spawn(_moveTo, _fadeOut)
        _actions.push(_spawnActions)
        _actions.push(_ccfunc)
        var _seq = cc.sequence(_actions)
        _mountCard.runAction(_seq)
        for (var i = _cardNodes.length - 1; i >= 0; i--) {
                var _node = _cardNodes[i]
             _node.rotation = 0   
        }
    },

    playGiveupGrayCard:function(location){
        var _ui_index = this.getUIRelativeIndex(location)
        var _mount_node = this.getPlayerMount(_ui_index)

        var _chipNodePointWorld = this.chipNode.convertToWorldSpaceAR(cc.p(0,0))
        var _chipNodePoinBaseMountNode = _mount_node.convertToNodeSpaceAR(_chipNodePointWorld)
        
        var _mountCard = cc.Client.UIHelper.FindNodeByName(_mount_node, "card_node")
        if(_mountCard){
            cc.Client.UIHelper.GrayNode(_mountCard)
        }
        this.showCardState(location, "giveup")
    },

    playSendCardAnimation:function(){

        if(!this.sendCardNode){
                return
        }

        this.sendCardNode.active = true

        var haveSeatReady = function(location){
            var _roloe_id = gFightMgr.getPlayerRoleId(location)
            // 有人入座
            if(_roloe_id != ""){
                // 入座并准备了
                var _bReady = gFightMgr.isReady(location)
                return _bReady
            }
        }

        var nextPlayerIndex = function(){
            if(self.m_playerUIIndex == 6 && self.m_cardIndex == 2){
                return false
            }

            if(self.m_playerUIIndex == 6){
                self.m_cardIndex++ 
                self.m_playerUIIndex = 0
            } else {
                self.m_playerUIIndex++
            }
            return true
        }

        var _targetMountNode = this.getPlayerMount(this.m_playerUIIndex)
        if(_targetMountNode){
            var _mountCard = cc.Client.UIHelper.FindNodeByName(_targetMountNode, "card_node")
            _mountCard.active = true
            var _cardNode = cc.Client.UIHelper.FindNodeByName(_mountCard, this.m_cardIndex+"")

            var _pointMountWorld = _mountCard.convertToWorldSpaceAR(cc.p(0,0))
            var _pointMountBaseSendCardSendNode = this.sendCardMountNode.convertToNodeSpaceAR(_pointMountWorld)

            var _actions = []
            var self = this
            var _resetAnimCard = function(){
                self.sendCardNode.active = false
                self.sendCardNode.position = cc.p(0, 0)
                self.sendCardNode.rotation = 0
            }
            var _nextCallback = function(){
                _resetAnimCard()
                if(_cardNode){
                    _cardNode.active = true
                    _cardNode.position = CARD_DEFAULT_POINT[self.m_cardIndex]
                    var _card_back = cc.Client.UIHelper.FindNodeByName(_cardNode, 'card_back_bg')
                    if(_card_back) _card_back.active = true
                    if(!nextPlayerIndex()){
                        return
                    }
                }
                self.playSendCardAnimation()
            }

            var _callback = cc.callFunc(_nextCallback)
            var _location = this.getLocationByUIIndex(this.m_playerUIIndex)
            if(_location != -1 && haveSeatReady(_location)){
                var _moveTo = cc.moveTo(0.2, _pointMountBaseSendCardSendNode)
                var _rotateTo = cc.rotateTo(0.2, 720)
                var _spawnActions = cc.spawn(_moveTo, _rotateTo)
                _actions.push(_spawnActions)
                _actions.push(_callback)
                var seq = cc.sequence(_actions)
                this.sendCardNode.runAction(seq)
            } else {
                cc.log("没有进行比赛的玩家位置ui_idnex, location", this.m_playerUIIndex, _location)
                _resetAnimCard()
                if(!nextPlayerIndex()){
                        return
                }
                self.playSendCardAnimation()
            }
        }

    },

    playLookCardAction:function(location, cardValues){
        var _ui_index = this.getUIRelativeIndex(location)
        var _bSelf = false
        if(_ui_index == 0){
            _bSelf = true
        }
        var _targetMountNode = this.getPlayerMount(_ui_index)
        if(_targetMountNode){
            var ShowBack = function(node, index){
                if(node){
                    var _card_fore_bg = cc.Client.UIHelper.FindNodeByName(node, "card_fore_bg")
                    var _car_value    = cc.Client.UIHelper.FindNodeByName(node, "car_value")
                    var _card_back_bg = cc.Client.UIHelper.FindNodeByName(node, "card_back_bg")
                    _card_fore_bg.active = false
                    _car_value.active = false
                    _card_back_bg.active = true
                    if(index == 1){
                        node.rotation = 20
                    } else if(index == 2){
                        node.rotation = 30
                    }
                }
            }

            var _mountCard = cc.Client.UIHelper.FindNodeByName(_targetMountNode, "card_node")
            var _card1 = cc.Client.UIHelper.FindNodeByName(_targetMountNode, "0")
            var _card2 = cc.Client.UIHelper.FindNodeByName(_targetMountNode, "1")
            var _card3 = cc.Client.UIHelper.FindNodeByName(_targetMountNode, "2")
            
            // 自己正显牌
            if(_bSelf){
                this.showPlayerCard(location, cardValues)
            // 其他玩家背显牌
            } else {
                this.showCardState(location, "look_card")
                ShowBack(_card1, 0)
                ShowBack(_card2, 1)
                ShowBack(_card3, 2)
            }
        } else {
            cc.log("not find the _targetMountNode")
        }
    },

    instantiateChip:function(chip_value){
        return cc.instantiate(this.chipTestPrefab)
    },

    setPlayerInfo:function(playerInfo) {
        if(!playerInfo){
            return
        }

        var _role_id = playerInfo.roleId
        var _locationIndex = gFightMgr.getPlayerIndex(_role_id)
        var _ui_index = this.getUIRelativeIndex(_locationIndex)
        var _playerHead = this.getPlayerHead(_ui_index)

        if(_playerHead){
            var _sp_head = cc.Client.UIHelper.FindNodeByName(_playerHead, "sp_head")
            // 头像节点存储，便于事件回调设置头像
            if(!this.m_playerHeadIconNode){
            this.m_playerHeadIconNode = {}
            }
            this.m_playerHeadIconNode[_role_id] = _sp_head

            var _txt_name  = cc.Client.UIHelper.FindNodeByName(_playerHead, "txt_name")
            var _txt_coin = cc.Client.UIHelper.FindNodeByName(_playerHead, "txt_coin")
            var _sp_vip_frame = cc.Client.UIHelper.FindNodeByName(_playerHead, "sp_vip_frame")

            if(_txt_coin){
                // 这里根据是自建房还是普通匹配房数值是不一样的
                _txt_coin.getComponent(cc.Label).string = playerInfo.coin
            }

            if(_txt_name){
                _txt_name.getComponent(cc.Label).string = playerInfo.roleName
            }

            if(_sp_vip_frame && playerInfo.vipRemainDay > 0){
                _sp_vip_frame.active = true
            }

            if(_sp_head){
                var _url = playerInfo.headURL//"http://wx.qlogo.cn/mmopen/g3MonUZtNHkdmzicIlibx6iaFqAc56vxLSUfpb6n5WKSYVY0ChQKkiaJSgQ1dZuTOgvLLrhJbERQQ4eMsv84eavHiaiceqxibJxCfHe/0"  
                if(!_url){ 
                        _url = "http://wx.qlogo.cn/mmopen/g3MonUZtNHkdmzicIlibx6iaFqAc56vxLSUfpb6n5WKSYVY0ChQKkiaJSgQ1dZuTOgvLLrhJbERQQ4eMsv84eavHiaiceqxibJxCfHe/0"  
                }
                var _headInfo = cc.Client.WechatHeadImageManager.getHeadSprite(_url, _role_id)
                if(_headInfo){
                        _sp_head.getComponent(cc.Sprite).spriteFrame = _headInfo.spriteFrame
                }
            }
        }
    },

    eventSetPlayerHeadImage:function(event){
            if(event){
                if(this.m_playerHeadIconNode){
                    var _data = event.getUserData()
                    var _head = this.m_playerHeadIconNode[_data.headInfo.tag]
                    if(_head){
                        _head.getComponent(cc.Sprite).spriteFrame = _data.headInfo.prefab.getComponent(cc.Sprite).spriteFrame
                    }
                }
            }
    },

    getPlayerHead:function(ui_index){
        return this.playerHead[ui_index]
    },

    getPlayerMount:function(ui_index){
        return this.playerMount[ui_index]
    },

    /**
     * 获取玩家在ui上的位置
     * @param  {number} index  玩家的实际位置
     * @param  {string} roleId 角色id
     * @return {number}        玩家ui上的位置
     */
    getUIRelativeIndex:function(index){
        var _mineRoleId = cc.Client.PlayerManager.getRoleId()
        var _myIndex = gFightMgr.getPlayerIndex(_mineRoleId)
        var _role_id = gFightMgr.getPlayerRoleId(index)

        if(_mineRoleId == _role_id){
            return 0
        } else {
            var _thatRelativeIndex = 0
            if(_myIndex == 0){
                return index
            } else {
                if(index > _myIndex ){
                        _thatRelativeIndex = index - _myIndex
                } else {
                        var _offsetIndex = FULL_PEOPLE_COUNT - _myIndex
                        _thatRelativeIndex = index + _offsetIndex    
                }
            }
            return _thatRelativeIndex   
        }
    },

    showPlayerOneCard:function(role_id, index, show_type){
        if(!cc.Client.gFightMgr){
            return
        }

        cc.log("显示的牌的索引", showCardIndex)
        var _player = cc.Client.gFightMgr.GetPlayer(role_id)
        if(_player){
            var _uiIndex = this.GetUIRelativeIndex(_player.locationIndex, role_id)
            var _onePlayerCardNode = Util.FindChildByName(this.panel.nodeDeskGirl, _uiIndex)

            if(_onePlayerCardNode){
                var _cardNode = Util.FindChildByName(_onePlayerCardNode, showCardIndex)
                if(_cardNode){
                    var _foreNode = Util.FindChildByName(_cardNode, "node_fore")
                    var _backNode = Util.FindChildByName(_cardNode, "node_background")
                    if(show_type == "fore"){
                        if(_foreNode){ 
                            _foreNode.active = true
                        }

                        if(_backNode){
                            _backNode.active = false
                        }
                    } else if(show_type == "background"){
                        if(_foreNode){
                            _foreNode.active = true
                        }

                        if(_backNode){
                            _backNode.active = false
                        }
                    }
                }
            }

        }
    },

    setRoomInfo:function(room_info){
        if(this.txtRoomNumber && room_info){
                this.txtRoomNumber.string = room_info.roomNum
        }
    },

    onDestroy:function(){
        this._super()
        cc.Client.MessageManager.off(this)
        cc.Client.UIStackManager.popUI(this.__classname__)
    },
})