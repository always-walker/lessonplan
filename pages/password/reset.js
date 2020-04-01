// pages/password/reset.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.checkLogin();
  },

  resetPassword: function(e) {
    var that = this;
    if (e.detail.value.password == "") {
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
        title: '重置中...',
      });
      wx.request({
        url: 'https://clientaccountserver.lessonplan.cn/user/putPassWord',
        method: 'PUT',
        data: {
          'PK_UserGuid': app.globalData.userGuid,
          'Password': e.detail.value.password
        },
        success: function(res) {
          wx.hideLoading();
          wx.showToast({
            title: '密码重置成功',
          });
          wx.navigateBack({
            delta: 2
          })
        }
      })
    }
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