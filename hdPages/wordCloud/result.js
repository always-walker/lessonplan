// hdPages/Discuss/result.js
const util = require('../../utils/util.js')
const http = require('../../utils/http.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    words: null,
    isInfo: true,
    triggered: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var id = options.id;
    var isInfo = app.checkInfo();
    this.setData({
      id: id,
      isInfo: isInfo
    });
    this.getResult();
  },

  getResult: function() {
    var that = this;
    var obj = app.globalData.hdObj[that.data.id];
    http.request({
      url: 'https://qrcodeserver.lessonplan.cn/' + that.data.id + '/' + obj.Type
    }, !this.data.triggered, !this.data.triggered).then(function(res) {
      var words = [];
      for (var i = 0; i < res.data.wordCloudInfo.length; i++) {
        var isExists = false;
        for (var j = 0; j < words.length; j++) {
          if (res.data.wordCloudInfo[i].Content == words[j].Content) {
            words[j].Count += 1;
            isExists = true;
            break;
          }
        }
        if (isExists == false) {
          words.push({
            'Content': res.data.wordCloudInfo[i].Content,
            'Count': 1
          });
        }
      }
      words.sort(util.compare('Count'));
      words.reverse();
      that.setData({
        words: words,
        triggered: false
      });
    });
  },

  onRefresh: function() {
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