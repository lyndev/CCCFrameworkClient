var GameUIRootNodeType = {
    Bottom: 1,   // 最底层ＵＩ
    Normal: 5,   // 普通UI的父节点类型
    Tips : 10,   // tipsUI的父节点类型
    Notice: 20,  // 公告的父节点类型
    Guide: 30,   // 新手引导的父节点类型
}

var TriggerType = 
{
    Uknow       : -1,   // 未知类型
    OpenUI      : 1,    // 打开UI
}

var UI_OPERATOR_TYPE = {
    OPEN : 1,
    CLOSE: 2,
}

var GameType = {
    NONE    : 0, // 无类型 
    NN      : 1, // 牛牛 
    MJ      : 2, // 麻将 
    DDZ     : 3, // 斗地主 
    ZJH     : 4, // 扎金花 
    TANK    : 5, // 坦克对战

}

var UIActionType = { 
    None  : 0,  // 不做任何操作
    Open  : 1,  // 打开
    Close : 2,  // 关闭
    Hide  : 3,  // 隐藏
    Show  : 4,  // 显示
}

var MsgActionType = {
    Send : 1, // 发送数据
    Recv : 2, // 接收数据
    Test : 3, // 测试数据
}

var RoomType = {
   NONE : 0,       // 无类型
   CUSTOM : 1,    // 自建房
   MATCH :2,     // 比赛房
   MATCHING:3,   // 匹配
}

var FightActionType = {
    NONE        :  0,    // 无类型
    A_READY     :  1,    // 准备
    A_UNREADY   :  2,    // 取消准备
    A_ROBOT     :  3,    // 托管
    A_UNROBOT   :  4,    // 取消托管
    A_WAIT      :  5,    // 等待
    A_UNWAIT    :  6,    // 取消等待
    A_GIVE_UP   :  10,   // 放弃
    A_LOOK_CARD :  11,   // 看牌
    A_OPEN_CARD :  12,   // 开牌
    A_COMPARE_CARD  :  13,   // 比牌
    A_ADD_SCORE     :  14,   // 比牌
    A_WAIT_COMPARE  :  15,   // 等待比牌
    A_THINKING      :  16,   // 思考中
    A_FOLLOW_SCORE  :  17,   // 跟注
    A_ONLINE        :  100,  // 上线
    A_OFFLINE       :  101,  // 下线
}


module.exports = {
    GameUIRootNodeType: GameUIRootNodeType,
    TriggerType: TriggerType,
    UI_OPERATOR_TYPE: UI_OPERATOR_TYPE,
    GameType: GameType,
    UIActionType:UIActionType,
    MsgActionType:MsgActionType,
    RoomType:RoomType,
    FightActionType:FightActionType,
}