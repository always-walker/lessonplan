// hdPages/Discuss/result.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    currentIndex: 0,
    surveyInfo: null,
    answer: null,
    isInfo: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var id = options.id;
    //var obj = app.globalData.hdObj[id];
    var isInfo = app.checkInfo();
    this.setData({
      id: id,
      isInfo: isInfo
    });
    this.getResult();
  },

  getResult: function() {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    });
    wx.request({
      url: 'https://qrcodeserver.lessonplan.cn/' + that.data.id + '/SurveyAndAnswer',
      success: function(res) {
        wx.hideLoading();
        var surveyInfo = res.data.surveyInfo;
        for (var i = 0; i < surveyInfo.questions.length; i++) {
          surveyInfo.questions[i]['answer'] = [];
          for (var j = 1; j <= surveyInfo.questions[i].options.length; j++) {
            var total = 0;
            var currentOption = 0;
            for (var k = 0; k < surveyInfo.answers.length; k++) {
              if (surveyInfo.answers[k].id == surveyInfo.questions[i].questionGuid) {
                total += surveyInfo.answers[k].count;
                if (j == parseInt(surveyInfo.answers[k].option))
                  currentOption = surveyInfo.answers[k].count;
              }
            }
            surveyInfo.questions[i]['answer'].push({
              'name': surveyInfo.questions[i].options[j-1],
              'total': total,
              'count': currentOption,
              'percent': total == 0 ? 0 : (Math.round(parseFloat((currentOption * 100 / total).toFixed(2)) * 100) / 100)
            });
          }
        }
        console.log(surveyInfo);
        var answer = surveyInfo.questions[that.data.currentIndex].answer;
        that.setData({
          surveyInfo: surveyInfo,
          answer: answer
        });
      }
    });
  },

  changeQuestion: function(e) {
    var index = e.currentTarget.dataset.index;
    this.setData({
      currentIndex: index,
      answer: this.data.surveyInfo.questions[index].answer
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