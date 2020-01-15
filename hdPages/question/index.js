// hdPages/Discuss/index.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    obj: null,
    defaultText: '',
    maxInputCount: 800,
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
      url: 'https://qrcodeserver.lessonplan.cn/' + id + '/question',
      success: function(res) {
        var questionList = res.data.data;
        for (var i = 0; i < questionList.length; i++) {
          questionList[i]['inputCount'] = 0;
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
    for (var key in e.detail.value) {
      questions.push('{"guid": "' + key + '", "answer": "' + e.detail.value[key] +'"}');
      if (e.detail.value[key] == '')
        isSubmit = false;
    }
    if (isSubmit) {
      var data = {
        'name': app.globalData.userInfo.NickName,
        'questions': questions,
        'creatorGuid': app.globalData.userGuid,
        'allowResubmission': that.data.obj.AllowResubmission,
        'verifyStatus': that.data.obj.InteractVerifyStatus
      };
      wx.request({
        url: 'https://qrcodeserver.lessonplan.cn/' + that.data.id + '/QuestionAndAnswer',
        method: 'POST',
        data: data,
        success: function(res) {
          //socket通知后台刷新
          app.sendSocket(that.data.id);
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
        title: '请输入你的回答',
        icon: 'none',
        duration: 1000
      });
    }
  },

  inputChange: function(e) {
    var index = e.currentTarget.dataset.index;
    var questionList = this.data.questionList;
    questionList[index].inputCount = e.detail.value.length;
    this.setData({
      questionList: questionList
    });
  },

  goResult: function () {
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
    this.setData({
      inputCount: 0,
      defaultText: ''
    });
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