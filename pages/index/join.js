// pages/index/join.js
const app = getApp()
const http = require('../../utils/http.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isInfo: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var isInfo = app.checkInfo();
    this.setData({
      isInfo: isInfo
    });
  },

  joinClass: function (e) {
    var that = this;
    if (e.detail.value.Code == '') {
      wx.showToast({
        title: '请输入班级邀请码',
        icon: 'none'
      })
    } else if (e.detail.value.Code.length < 8) {
      wx.showToast({
        title: '班级邀请码为8位',
        icon: 'none'
      })
    } else {
      http.request({
        url: 'https://codeserver.lessonplan.cn/api/search?text=' + e.detail.value.Code
      }).then(function (res) {
        if (res.data.status == 1) {
          wx.navigateTo({
            url: '/pages/names/join?classId=' + res.data.data.FK_ClassGuid,
          });
        } else {
          wx.showToast({
            title: res.data.err,
            icon: 'none'
          })
        }
      });
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