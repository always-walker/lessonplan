// pages/names/index.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    classList: [],
    hasClass: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中...',
    })
    var that = this;
    wx.request({
      url: 'https://clientaccountserver.lessonplan.cn/user/joined/' + app.globalData.userGuid,
      success: function(res) {
        if (res.data.data.length > 0) {
          var classListString = [];
          for (var row in res.data.data) {
            classListString.push('"' + res.data.data[row].FK_ClassGuid + '"');
          }
          wx.request({
            url: 'https://rosterserver.lessonplan.cn/class/private?classListString=' + classListString.join(','),
            success: function(res2) {
              wx.hideLoading();
              that.setData({
                classList: res2.data.data
              });
            }
          })
        } else {
          wx.hideLoading();
        }
        var hasClass = res.data.data.length > 0 ? true : false;
        that.setData({
          hasClass: hasClass
        });
      }
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