// pages/login/index.js
const app = getApp()
const http = require('../../utils/http.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (!app.globalData.code) {
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          if (res.errMsg == "login:ok") {
            app.globalData.code = res.code;
          }
        }
      });
    }
  },

  getInfo: function() {
    http.request({
      url: 'https://clientaccountserver.lessonplan.cn/user/usermsg/' + app.globalData.userGuid
    }).then(function(res) {
      if (!res.data.data.HeadPhotoPath)
        res.data.data.HeadPhotoPath = 'https://cdn.lessonplan.cn/Public/IMG/default-avatar.png';
      if (res.data.data.HeadPhotoPath.indexOf('http') == -1)
        res.data.data.HeadPhotoPath = 'https://static.lessonplan.cn' + res.data.data.HeadPhotoPath;
      app.globalData.userInfo = res.data.data;
      wx.hideLoading();
      wx.reLaunch({
        url: '/pages/index/index',
      });
    });
  },

  infoLogin(userInfo) {
    var that = this;
    if (!userInfo.encryptedData) {
      that.qzWeLogin();
    } else {
      http.request({
        method: 'post',
        url: 'https://clientpassport.lessonplan.cn/wx/wxapp',
        data: {
          code: app.globalData.code,
          encryptedData: userInfo.encryptedData,
          iv: userInfo.iv,
          nickname: userInfo.userInfo.nickName,
          headimgurl: userInfo.userInfo.avatarUrl
        }
      }).then(function(res) {
        app.globalData.code = null;
        app.globalData.token = res.data.token
        app.globalData.userGuid = res.data.userGuid;
        that.getInfo();
      });
    }
  },

  welogin: function(e) {
    var that = this;
    that.infoLogin(e.detail);
  },

  welogin2: function() {
    var that = this;
    wx.getUserInfo({
      withCredentials: true,
      lang: 'zh_CN',
      success: function(userRes) {
        //可以请求登录
        that.infoLogin(userRes);
      },
      fail: function(failRes) {
        wx.hideLoading();
        wx.showToast({
          title: '请允许授权后再登录',
          icon: 'none',
          duration: 1000
        })
      }
    });
  },

  goAccountLogin: function(){
    wx.navigateTo({
      url: '/pages/login/account',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})