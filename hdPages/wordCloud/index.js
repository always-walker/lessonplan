const qiniuUploader = require('../../utils/qiniuUploader-min.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    obj: null,
    inputCount: 0,
    defaultText: '',
    maxInputCount: 12
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var id = options.id;
    var obj = app.globalData.hdObj[id];
    this.setData({
      id: id,
      obj: obj,
    });
  },

  submitForm: function(e) {
    var that = this;
    if (e.detail.value.content == '') {
      wx.showToast({
        title: '请输入你的关键词',
        icon: 'none',
        duration: 1000
      });
    } else {
      var data = {
        'name': app.globalData.userInfo.NickName,
        'content': e.detail.value.content,
        'creatorGuid': app.globalData.userGuid,
        'allowResubmission': that.data.obj.AllowResubmission,
        'verifyStatus': that.data.obj.InteractVerifyStatus
      };
      wx.showLoading({
        title: '提交中...',
      });
      wx.request({
        url: 'https://qrcodeserver.lessonplan.cn/' + that.data.id + '/wordCloud',
        data: data,
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res) {
          if (res.data.status == 1) {
            wx.hideLoading();
            wx.redirectTo({
              url: 'success?id=' + that.data.id,
            });
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 1000
            });
          }
        }
      });
    }
  },

  inputChange: function(e) {
    this.setData({
      inputCount: e.detail.value.length
    });
  },

  goResult: function(){
    wx.navigateTo({
      url: 'result?id=' + this.data.id,
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
  onUnload: function() {},

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