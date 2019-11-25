// pages/safe/password.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    password: '',
    oldPassword: '',
    confirmPassword: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!app.globalData.userGuid) {
      wx.redirectTo({
        url: '/pages/login/index',
      });
      return;
    }
  },

  modify: function (e) {
    var that = this;
    if (e.detail.value.oldPassword == "") {
      wx.showToast({
        title: '请输入原始密码',
        icon: 'none',
        duration: 1000
      })
    } else if (e.detail.value.password == "") {
      wx.showToast({
        title: '请输入密码',
        icon: 'none',
        duration: 1000
      })
    } else if (e.detail.value.confirmPassword != e.detail.value.password) {
      wx.showToast({
        title: '两次密码输入不一致',
        icon: 'none',
        duration: 1000
      })
    } else if (!(/^.{6,20}$/.test(e.detail.value.password))) {
      wx.showToast({
        title: '您的密码设置过于简单',
        icon: 'none',
        duration: 1000
      })
    } else {
      wx.showLoading({
        title: '更新中...',
      });
      wx.request({
        url: 'https://clientaccountserver.lessonplan.cn/user/info/pass',
        data: { 'userGuid': app.globalData.userGuid, 'password': e.detail.value.oldPassword},
        success: function (res) {
          if (res.data.data.length > 0) {
            wx.request({
              url: 'https://clientaccountserver.lessonplan.cn/user/putPassWord',
              method: 'PUT',
              data: { 'PK_UserGuid': app.globalData.userGuid, 'Password': e.detail.value.password},
              success: function (res2) {
                wx.hideLoading();
                that.setData({
                  password: '',
                  oldPassword: '',
                  confirmPassword: ''
                });
                wx.showToast({
                  title: '密码修改成功',
                });
              }
            })
          } else {
            wx.hideLoading()
            wx.showToast({
              title: '原始密码输入错误',
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