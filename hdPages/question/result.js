// hdPages/Discuss/result.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    currentIndex: 0,
    questionInfo: null,
    answer: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var id = options.id;
    var obj = app.globalData.hdObj[id];
    wx.request({
      url: 'https://qrcodeserver.lessonplan.cn/' + id + '/QuestionAndAnswer',
      success: function(res) {
        var questionInfo = res.data.questionInfo;
        var answer = questionInfo[0].content;
        that.setData({
          id: id,
          questionInfo: questionInfo,
          answer: answer
        });
      }
    });
  },

  changeQuestion: function(e) {
    var index = e.currentTarget.dataset.index;
    this.setData({
      currentIndex: index,
      answer: this.data.questionInfo[index].content
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