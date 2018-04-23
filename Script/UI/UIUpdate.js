module.exports = cc.Class({
    extends: cc.Component,

    properties: {
        info: cc.Label,
        fileProgress: cc.ProgressBar,
        fileLabel: cc.Label,
        byteProgress: cc.ProgressBar,
        byteLabel: cc.Label,
        close: cc.Node,
        checkBtn: cc.Node,
        retryBtn: cc.Node,
        updateBtn: cc.Node,
        pathLabel:cc.Label,
    },
    
    onLoad () {
    }
});
