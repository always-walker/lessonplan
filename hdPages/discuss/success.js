// hdPages/Discuss/success.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    tipText: '提交成功',
    allowResubmission: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var id = options.id;
    var obj = app.globalData.hdObj[id];
    var tipText = '提交成功';
    if (options.status && options.status == 1){
      tipText = '您已经提交'
    }
    this.setData({
      id: id,
      tipText: tipText,
      allowResubmission: obj.AllowResubmission
    });
  },

  goResult: function() {
    var that = this;
    wx.navigateTo({
      url: 'result?id=' + that.data.id,
    });
  },

  goSubmit: function() {
    var that = this;
    wx.redirectTo({
      url: 'index?id=' + that.data.id,
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