//app.js
const io = require('utils/weapp.socket.io.js');
App({
  onLaunch: function () {
    wx.clearStorageSync()
    //this.globalData.userInfo = wx.getStorageSync('userInfo')
    //this.globalData.token = wx.getStorageSync('token')
    if (this.globalData.userInfo && this.globalData.token){
      this.globalData.userGuid = this.globalData.userInfo.PK_UserGuid
    }
  },
  globalData: {
    userInfo: null,
    userGuid: null,
    token: null,
    isFindPasswordVerfy: false,
    videoObj: null,
    hdObj: {}
  },
  sendSocket: function (interactGuid){
    const socket = io('wss://io.lessonplan.cn/');
    socket.emit('interact', { interactGuid });
  }
})