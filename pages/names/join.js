// pages/names/join.js
const app = getApp()
const http = require('../../utils/http.js')

Page({

  data: {
    curClass: null,
    isJoinClass: false,
    isInfo: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var isInfo = app.checkInfo();
    this.setData({
      isInfo: isInfo
    });
    let res = null;
    http.request({
      url: 'https://rosterserver.lessonplan.cn/class/private?classListString="' + options.classId + '"'
    }, true, false).then(function(res1) {
      res = res1;
      return http.request({
        url: 'https://clientaccountserver.lessonplan.cn/user/joined/' + app.globalData.userGuid
      }, false, true);
    }).then(function(res2) {
      var isJoinClass = false;
      for (var i = 0; i < res2.data.data.length; i++) {
        if (res2.data.data[i].FK_ClassGuid == options.classId) {
          isJoinClass = true;
          break;
        }
      }
      that.setData({
        curClass: res.data.data[0],
        isJoinClass: isJoinClass
      });
    });
  },

  joinClass: function() {
    if (this.data.isJoinClass == false) {
      var that = this;
      http.request({
        url: 'https://rosterserver.lessonplan.cn/class/join2',
        method: 'POST',
        data: {
          FK_UserGuid: app.globalData.userGuid,
          FK_ClassGuid: that.data.curClass.PK_ClassGuid
        }
      }).then(function(res) {
        app.globalData.classId = that.data.curClass.PK_ClassGuid;
        wx.hideLoading();
        if (res.data.status == 1) {
          wx.redirectTo({
            url: '/pages/names/joindetail?classId=' + that.data.curClass.PK_ClassGuid,
          });
        } else {
          wx.showToast({
            title: res.data.err,
          })
        }
      });
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