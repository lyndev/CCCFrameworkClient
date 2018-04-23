//********************************************************************************
//  generate: protoForJsTableTool
//  version: v1.0.1
//  author: UndaKunteera
//********************************************************************************

cc.Class({
    extends: cc.Component,
    init : function(){
        cc.GameMsg.MSG_TYPE[ 130501 ] = "Friend.ReqAllFriendInfo" // 获取所有好友信息
        cc.GameMsg.MSG_TYPE[ 130502 ] = "Friend.ReqApplyFriend" // 申请好友
        cc.GameMsg.MSG_TYPE[ 130503 ] = "Friend.ReqRemoveFriend" // 删除好友
        cc.GameMsg.MSG_TYPE[ 130504 ] = "Friend.ReqSearchFriend" // 搜索好友
        cc.GameMsg.MSG_TYPE[ 130601 ] = "Friend.ResAllFriendInfo" // 服务器返回所有好友信息
        cc.GameMsg.MSG_TYPE[ 130602 ] = "Friend.ResApplyFriend" // 服务器返回添加好友结果
        cc.GameMsg.MSG_TYPE[ 130603 ] = "Friend.ResRemoveFriend" // 服务器返回删除好友结果
        cc.GameMsg.MSG_TYPE[ 130604 ] = "Friend.ResSearchFriend" // 服务器返回搜索到的玩家
        cc.GameMsg.MSG_TYPE[ 130606 ] = "Friend.NotifyFriendOnline" // 好友上线通知
        cc.GameMsg.MSG_TYPE[ 130607 ] = "Friend.NotifyFriendOffline" // 好友下线通知

        cc.GameMsg.MSGID._FRIEND_REQALLFRIENDINFO = 130501 // 获取所有好友信息
        cc.GameMsg.MSGID._FRIEND_REQAPPLYFRIEND = 130502 // 申请好友
        cc.GameMsg.MSGID._FRIEND_REQREMOVEFRIEND = 130503 // 删除好友
        cc.GameMsg.MSGID._FRIEND_REQSEARCHFRIEND = 130504 // 搜索好友
        cc.GameMsg.MSGID._FRIEND_RESALLFRIENDINFO = 130601 // 服务器返回所有好友信息
        cc.GameMsg.MSGID._FRIEND_RESAPPLYFRIEND = 130602 // 服务器返回添加好友结果
        cc.GameMsg.MSGID._FRIEND_RESREMOVEFRIEND = 130603 // 服务器返回删除好友结果
        cc.GameMsg.MSGID._FRIEND_RESSEARCHFRIEND = 130604 // 服务器返回搜索到的玩家
        cc.GameMsg.MSGID._FRIEND_NOTIFYFRIENDONLINE = 130606 // 好友上线通知
        cc.GameMsg.MSGID._FRIEND_NOTIFYFRIENDOFFLINE = 130607 // 好友下线通知

        cc.log('网络消息编号注册完毕！模块：Friend')
    }
})