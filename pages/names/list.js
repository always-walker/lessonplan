// pages/names/list.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    classList: [],
    currentClassName: null,
    currentClassGuid: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      currentClassGuid: options.classId,
      currentClassName: options.className
    });
    this.getClass();
  },

  goIndex: function(e) {
    wx.reLaunch({
      url: '/pages/index/index?classId=' + this.data.classList[e.currentTarget.dataset.index].PK_ClassGuid,
    })
  },

  getClass: function() {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
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