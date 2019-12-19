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
    var id = options.id;
    //var obj = app.globalData.hdObj[id];
    this.setData({
      id: id
    });
    this.getResult();
  },

  getResult: function() {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    });
    wx.request({
      url: 'https://qrcodeserver.lessonplan.cn/' + that.data.id + '/StructuredDiscussAndAnswer',
      success: function(res) {
        console.log(res.data);
        wx.hideLoading();
        var questionInfo = res.data.questionInfo;
        for (var i = 0; i < questionInfo.length; i++) {
          questionInfo[i].content.reverse();
        }
        var answer = questionInfo[that.data.currentIndex].content;
        that.setData({
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

  onPullDownRefresh: function() {
    this.getResult();
    wx.stopPullDownRefresh();
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