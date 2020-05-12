// pages/safe/protect.js
const app = getApp()
const http = require('../../utils/http.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    protection: [],
    passwordProtection: [],
    isInfo: false
  },

  bindProtectionChange: function(e) {
    var _protection = this.data.protection;
    _protection[e.target.dataset.index].index = e.detail.value;
    this.setData({
      protection: _protection,
    })
  },

  modify: function(e) {
    console.log(e.detail.value);
    console.log(this.data.protection);
    //先按照只有一个问题
    if (!e.detail.value.question_0) {
      wx.showToast({
        title: '请选择密保问题',
        icon: 'none',
        duration: 1000
      })
    } else if (e.detail.value.answer_0 == '') {
      wx.showToast({
        title: '请输入密保答案',
        icon: 'none',
        duration: 1000
      })
    } else {
      var index = parseInt(e.detail.value.question_0);
      var PK_ProblemGuid = this.data.passwordProtection[index].PK_ProblemGuid;
      http.request({
        url: 'https://clientaccountserver.lessonplan.cn/user/putSecurity',
        method: 'PUT',
        data: {
          'PK_UserGuid': app.globalData.userGuid,
          'PK_ProblemGuid': PK_ProblemGuid,
          'Answer': e.detail.value.answer_0
        }
      }, true, true).then(function(res) {
        wx.showToast({
          title: '密保修改成功',
        });
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.checkLogin();
    var isInfo = app.checkInfo();
    this.setData({
      isInfo: isInfo
    });
    var that = this;
    http.request({
      url: 'https://clientaccountserver.lessonplan.cn/user/info/problem?userGuid=' + app.globalData.userGuid,
    }, false, false).then(function(res) {
      http.request({
        url: 'https://clientaccountserver.lessonplan.cn/user/problem',
      }, false, false).then(function(res2) {
        var _protection = res.data.data;
        var _passwordProtection = res2.data.data;
        for (var j = 0; j < _protection.length; j++) {
          for (var i = 0; i < _passwordProtection.length; i++) {
            if (_protection[j].FK_ProblemGuid == _passwordProtection[i].PK_ProblemGuid) {
              _protection[j]['index'] = i;
            }
          }
        }
        console.log(_protection);
        that.setData({
          protection: _protection,
          passwordProtection: _passwordProtection
        });
      });
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