// hdPages/Discuss/result.js
const http = require('../../utils/http.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    showType: 2,
    currentIndex: 0,
    childIndex: 0,
    scrollLeft: 0,
    questionInfo: null,
    answer: null,
    isInfo: true,
    triggered: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var id = options.id;
    var isInfo = app.checkInfo();
    //var obj = app.globalData.hdObj[id];
    this.setData({
      id: id,
      isInfo: isInfo
    });
    this.getResult();
  },

  getResult: function() {
    var that = this;
    http.request({
      url: 'https://qrcodeserver.lessonplan.cn/' + that.data.id + '/StructuredDiscussAndAnswer'
    }, !this.data.triggered, !this.data.triggered).then(function(res) {
      var showType = 1;
      if (res.data.interactInfo.Model == 'steamroller')
        showType = 2;
      var questionInfo = res.data.questionInfo;
      for (var i = 0; i < questionInfo.length; i++) {
        questionInfo[i].content.reverse();
      }
      var answer = questionInfo[that.data.currentIndex].content;
      that.setData({
        questionInfo: questionInfo,
        showType: showType,
        answer: answer,
        triggered: false
      });
    });
  },

  changeQuestion: function(e) {
    var index = e.currentTarget.dataset.index;
    this.setData({
      currentIndex: index,
      childIndex: 0,
      scrollLeft: 0,
      answer: this.data.questionInfo[index].content
    });
  },

  changeChildQuestion: function(e) {
    this.setData({
      childIndex: e.currentTarget.dataset.index
    });
  },

  onRefresh: function () {
    this.setData({
      triggered: true
    });
    this.getResult();
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