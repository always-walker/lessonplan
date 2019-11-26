//app.js
App({
  onLaunch: function () {
    //wx.clearStorageSync()
    this.globalData.userInfo = wx.getStorageSync('userInfo')
    this.globalData.token = wx.getStorageSync('token')
    if (this.globalData.userInfo && this.globalData.token){
      this.globalData.userGuid = this.globalData.userInfo.PK_UserGuid
    }
  },
  globalData: {
    userInfo: null,
    userGuid: null,
    token: null,
    isFindPasswordVerfy: false
  }
})