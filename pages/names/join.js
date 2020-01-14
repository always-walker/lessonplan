// pages/names/join.js
const app = getApp()

Page({

  data: {
    curClass: null,
    isJoinClass: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: 'https://rosterserver.lessonplan.cn/class/private?classListString="' + options.classId + '"',
      success: function(res) {
        wx.request({
          url: 'https://clientaccountserver.lessonplan.cn/user/joined/' + app.globalData.userGuid,
          success: function(res2) {
            var isJoinClass = false;
            for (var i = 0; i < res2.data.data.length; i++) {
              if (res2.data.data[i].FK_ClassGuid == options.classId) {
                isJoinClass = true;
                break;
              }
            }
            wx.hideLoading();
            that.setData({
              curClass: res.data.data[0],
              isJoinClass: isJoinClass
            });
          }
        });
      }
    });
  },

  joinClass: function() {
    if(this.data.isJoinClass == false){
      var that = this;
      wx.showLoading({
        title: '加载中...',
      })
      wx.request({
        url: 'https://rosterserver.lessonplan.cn/class/join2',
        method: 'POST',
        data: {
          FK_UserGuid: app.globalData.userGuid,
          FK_ClassGuid: that.data.curClass.PK_ClassGuid
        },
        success: function (res) {
          wx.hideLoading();
          if (res.data.status == 1) {
            wx.redirectTo({
              url: '/pages/index/index?classId=' + that.data.curClass.PK_ClassGuid,
            });
          }
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