//********************************************************************************
//  generate: protoForJsTableTool
//  version: v1.0.1
//  author: UndaKunteera
//********************************************************************************

cc.Class({
    extends: cc.Component,
    init : function(){
        cc.GameMsg.MSG_TYPE[ 106201 ] = "Task.ReqGetMainTaskAward" // 领取奖励
        cc.GameMsg.MSG_TYPE[ 106101 ] = "Task.ResMainTaskInfo" // 更新任务如果没有则为新增如果有则为更新状态语义
        cc.GameMsg.MSG_TYPE[ 106102 ] = "Task.ResGetMainTaskAward" // 领取奖励结果
        cc.GameMsg.MSG_TYPE[ 106103 ] = "Task.ResUpdateMainTask" // 任务列表更新
        cc.GameMsg.MSG_TYPE[ 106211 ] = "Task.ReqGetOneDailyTaskAward" // 领取一个日常任务奖励
        cc.GameMsg.MSG_TYPE[ 106111 ] = "Task.ResDailyTaskInfo" // 更新任务如果没有则为新增如果有则为更新状态语义
        cc.GameMsg.MSG_TYPE[ 106112 ] = "Task.ResGetOneDailyTaskAward" // 领取日常任务结果
        cc.GameMsg.MSG_TYPE[ 106113 ] = "Task.ResUpdateDailyTask" // 更新任务如果没有则为新增如果有则为更新状态语义

        cc.GameMsg.MSGID.CS_TASK_REQGETMAINTASKAWARD = 106201 // 领取奖励
        cc.GameMsg.MSGID.SC_TASK_RESMAINTASKINFO = 106101 // 更新任务如果没有则为新增如果有则为更新状态语义
        cc.GameMsg.MSGID.SC_TASK_RESGETMAINTASKAWARD = 106102 // 领取奖励结果
        cc.GameMsg.MSGID.SC_TASK_RESUPDATEMAINTASK = 106103 // 任务列表更新
        cc.GameMsg.MSGID.CS_TASK_REQGETONEDAILYTASKAWARD = 106211 // 领取一个日常任务奖励
        cc.GameMsg.MSGID.SC_TASK_RESDAILYTASKINFO = 106111 // 更新任务如果没有则为新增如果有则为更新状态语义
        cc.GameMsg.MSGID.SC_TASK_RESGETONEDAILYTASKAWARD = 106112 // 领取日常任务结果
        cc.GameMsg.MSGID.SC_TASK_RESUPDATEDAILYTASK = 106113 // 更新任务如果没有则为新增如果有则为更新状态语义

        cc.log('网络消息编号注册完毕！模块：Task')
    }
})