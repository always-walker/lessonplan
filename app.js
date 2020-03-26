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
    //在这里处理登录的情况
    // 登录
    wx.login({
      success: res => {
        this.globalData.code = res.code;
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.wxUserInfo = res.userInfo
    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
    //登录处理完毕
  },
  globalData: {
    code: null,
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