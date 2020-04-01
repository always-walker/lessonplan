// pages/password/find.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    passwordProtection: [],
    index: -1,
    protectionText: '选择密保问题'
  },

  bindProtectionChange: function(e) {
    this.setData({
      index: e.detail.value,
      protectionText: this.data.passwordProtection[e.detail.value].Content
    })
  },

  bindNext: function(e) {
    if (e.detail.value.Name == '') {
      wx.showToast({
        title: '请输入手机号码/邮箱',
        icon: 'none'
      });
    } else if (this.data.index < 0) {
      wx.showToast({
        title: '请选择密保问题',
        icon: 'none'
      });
    } else if (e.detail.value.Answer == '') {
      wx.showToast({
        title: '请输入密保答案',
        icon: 'none'
      });
    } else {
      wx.showLoading({
        title: '加载中...',
      });
      var that = this;
      wx.request({
        url: 'https://clientaccountserver.lessonplan.cn/user/getProblem?Name=' + e.detail.value.Name,
        success: function(res) {
          if (res.data.status == 1) {
            if (res.data.data.Content == that.data.passwordProtection[that.data.index].Content) {
              app.globalData.userGuid = res.data.data.PK_UserGuid;
              wx.request({
                url: 'https://clientaccountserver.lessonplan.cn/user/getAnswer',
                data: {
                  'Name': e.detail.value.Name,
                  'Answer': e.detail.value.Answer
                },
                success: function(res2) {
                  wx.hideLoading();
                  wx.showToast({
                    title: res2.data.data,
                    icon: 'none'
                  });
                  if (res2.data.status == 1) {
                    app.globalData.isFindPasswordVerfy = true;
                    wx.navigateTo({
                      url: 'reset'
                    })
                  }
                }
              })
            } else {
              wx.hideLoading();
              wx.showToast({
                title: '验证失败',
                icon: 'none'
              });
            }
          } else {
            wx.hideLoading();
            wx.showToast({
              title: res.data.err,
              icon: 'none'
            });
          }
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.request({
      url: 'https://clientaccountserver.lessonplan.cn/user/problem',
      success: function(res) {
        that.setData({
          passwordProtection: res.data.data
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