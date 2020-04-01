// pages/login/index.js
const app = getApp()
const http = require('../../utils/http.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  getInfo: function () {
    wx.request({
      url: 'https://clientaccountserver.lessonplan.cn/user/usermsg/' + app.globalData.userGuid,
      success: function (res) {
        if (!res.data.data.HeadPhotoPath)
          res.data.data.HeadPhotoPath = 'https://cdn.lessonplan.cn/Public/IMG/default-avatar.png';
        if (res.data.data.HeadPhotoPath.indexOf('http') == -1)
          res.data.data.HeadPhotoPath = 'https://static.lessonplan.cn' + res.data.data.HeadPhotoPath;
        //if (!res.data.data.Msg)
        //  res.data.data.Msg = '尚未签名';
        app.globalData.userInfo = res.data.data;
        /*wx.setStorage({
          key: 'userInfo',
          data: res.data.data
        });
        wx.setStorage({
          key: 'token',
          data: app.globalData.token
        });*/
        wx.hideLoading();
        wx.reLaunch({
          url: '/pages/index/index',
        });
      }
    })
  },

  welogin: function (e) {
    wx.navigateBack({
      delta: 1
    })
  },

  login: function (e) {
    var that = this
    if (e.detail.value.username == "") {
      wx.showToast({
        title: '请输入手机号码',
        icon: 'none',
        duration: 1000
      })
    } else if (e.detail.value.password == "") {
      wx.showToast({
        title: '请输入密码',
        icon: 'none',
        duration: 1000
      })
    } else {
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: 'https://clientpassport.lessonplan.cn/auth',
        data: e.detail.value,
        success: function (res) {
          if (res.data.status == 1) {
            app.globalData.token = res.data.token
            wx.request({
              url: 'https://clientpassport.lessonplan.cn/auth/verify',
              data: {
                token: res.data.token
              },
              success: function (res2) {
                app.globalData.userGuid = res2.data.userGuid;
                that.getInfo();
              }
            })
          } else {
            wx.hideLoading()
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 1000
            })
          }
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})