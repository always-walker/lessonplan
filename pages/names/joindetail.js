// pages/names/joindetail.js
const app = getApp()
const http = require('../../utils/http.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    curClass: null,
    isInfo: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var isInfo = app.checkInfo();
    var that = this;
    http.request({
      url: 'https://rosterserver.lessonplan.cn/class/private?classListString="' + options.classId + '"'
    }).then(res => {
      that.setData({
        curClass: res.data.data[0],
        isInfo: isInfo
      });
    });
  },

  gostudy: function(){
    app.globalData.classId = this.data.curClass.PK_ClassGuid;
    wx.switchTab({
      url: '/pages/index/index',
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