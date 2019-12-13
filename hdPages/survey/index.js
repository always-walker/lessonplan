// hdPages/Discuss/index.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    obj: null,
    questionList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var id = options.id;
    var obj = app.globalData.hdObj[id];
    wx.request({
      url: 'https://qrcodeserver.lessonplan.cn/' + id + '/survey',
      success: function(res) {
        var questionList = res.data.data;
        for (var i = 0; i < questionList.length; i++) {
          questionList[i]['AnswerList'] = questionList[i].Answer.split('|||');
        }
        that.setData({
          id: id,
          obj: obj,
          questionList: questionList
        });
      }
    })
  },

  submitForm: function(e) {
    var that = this;
    var questions = [];
    var isSubmit = true;
    console.log(e.detail.value);
    for (var key in e.detail.value) {
      var curAnswer = [];
      if (typeof(e.detail.value[key]) == 'string') {
        if (e.detail.value[key] == '')
          isSubmit = false;
        else
          curAnswer.push(parseInt(e.detail.value[key]) + 1);
      } else if (typeof(e.detail.value[key]) == 'object') {
        if (e.detail.value[key].length > 0) {
          for (var i = 0; i < e.detail.value[key].length; i++)
            curAnswer.push(parseInt(e.detail.value[key][i]) + 1);
        } else {
          isSubmit = false;
        }
      }
      questions.push('{"guid": "' + key + '", "answer": ' + JSON.stringify(curAnswer) + '}');
      if (e.detail.value[key] == '')
        isSubmit = false;
    }
    if (isSubmit) {
      var data = {
        'name': app.globalData.userInfo.NickName,
        'questions': questions,
        'creatorGuid': app.globalData.userGuid,
        'verifyStatus': that.data.obj.InteractVerifyStatus
      };
      console.log(data);
      wx.request({
        url: 'https://qrcodeserver.lessonplan.cn/' + that.data.id + '/SurveyAndAnswer',
        method: 'POST',
        data: data,
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
      })
    } else {
      wx.showToast({
        title: '请答完问卷再提交',
        icon: 'none',
        duration: 1000
      });
    }
  },

  goResult: function() {
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