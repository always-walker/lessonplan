// pages/my/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    isInfo: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.checkLogin();
    var isInfo = app.checkInfo();
    this.setData({
      userInfo: app.globalData.userInfo,
      isInfo: isInfo
    });
  },

  loginout: function() {
    wx.clearStorageSync();
    app.globalData.userGuid = null;
    wx.reLaunch({
      url: '/pages/login/index',
    });
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
    var isInfo = app.checkInfo();
    this.setData({
      userInfo: app.globalData.userInfo,
      isInfo: isInfo
    });
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