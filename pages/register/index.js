// pages/register/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    passwordProtection: [],
    index: -1,
    protectionText: '选择密保问题',
    isVerfy: false,
    isCheck: false
  },

  register: function(e) {
    var data = e.detail.value;
    if (!(/^(1(3[0-9]|4[5,7]|5[0,1,2,3,4,5,6,7,8,9]|6[2,5,6,7]|7[0,1,7,8]|8[0-9]|9[1,8,9])\d{8}|\w+@[a-z0-9]+\.[a-z]{2,4})$/.test(data.Name))) {
      wx.showToast({
        title: '请输入正确的手机号码或者邮箱',
        icon: 'none'
      })
    } else if (data.NickName == '') {
      wx.showToast({
        title: '请输入昵称/姓名',
        icon: 'none'
      })
    } else if (data.Password == '') {
      wx.showToast({
        title: '请输入密码',
        icon: 'none'
      })
    } else if (data.ConfirmPassword != data.Password) {
      wx.showToast({
        title: '两次密码输入不一致',
        icon: 'none'
      })
    } else if (!(/^.{6,20}$/.test(data.Password))) {
      wx.showToast({
        title: '您的密码设置过于简单',
        icon: 'none'
      })
    } else if (this.data.index < 0) {
      wx.showToast({
        title: '请选择密保问题',
        icon: 'none'
      })
    } else if (data.Answer == '') {
      wx.showToast({
        title: '请输入密保答案',
        icon: 'none'
      })
    } else if (!this.data.isVerfy) {
      wx.showToast({
        title: '请向右滑动滑块验证',
        icon: 'none'
      })
    } else if (!this.data.isCheck) {
      wx.showToast({
        title: '请先阅读用户协议',
        icon: 'none'
      })
    } else {
      data.FK_ProblemGuid = this.data.passwordProtection[this.data.index].PK_ProblemGuid;
      if (/^1(3[0-9]|4[5,7]|5[0,1,2,3,4,5,6,7,8,9]|6[2,5,6,7]|7[0,1,7,8]|8[0-9]|9[1,8,9])\d{8}$/.test(data.Name))
        data['Phone'] = data.Name;
      else if (/^\w+@[a-z0-9]+\.[a-z]{2,4}$/.test(data.Name))
        data['Email'] = data.Name;
      wx.showLoading({
        title: '加载中',
      });
      wx.request({
        url: 'https://clientaccountserver.lessonplan.cn/user/register',
        method: 'POST',
        data: data,
        success: function(res) {
          wx.hideLoading();
          if (res.data.status == 0) {
            wx.showToast({
              title: res.data.err,
              icon: 'none'
            })
          } else {
            wx.showToast({
              title: "注册成功",
            });
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
    }
  },

  checkAgreement: function(e) {
    if (e.detail.value.length > 0) {
      this.setData({
        isCheck: true
      });
    } else {
      this.setData({
        isCheck: false
      });
    }
  },

  myEventListener: function(e) {
    //获取到组件的返回值，并将其打印
    this.setData({
      isVerfy: e.detail.msg
    });
  },

  bindProtectionChange: function(e) {
    this.setData({
      index: e.detail.value,
      protectionText: this.data.passwordProtection[e.detail.value].Content
    })
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