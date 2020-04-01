// hdPages/Discuss/result.js

const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    studentList: null,
    stat: null,
    isInfo: true
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
    wx.showLoading({
      title: '加载中...',
    });
    wx.request({
      url: 'https://signinserver.lessonplan.cn/signinResult/' + that.data.id,
      success: function(res) {
        var signInfo = res.data.signinResultList;
        wx.request({
          url: 'https://clientaccountserver.lessonplan.cn/user/studentlist/letter/' + res.data.signinInfo.FK_ClassGuid,
          success: function(res2) {
            wx.hideLoading();
            var studentList = res2.data.data;
            var stat = [0, 0, 0, 0];
            for (var i = 0; i < studentList.length; i++) {
              for (var j = 0; j < signInfo.length; j++) {
                if (studentList[i].PK_UserGuid == signInfo[j].FK_StudentGuid) {
                  studentList[i]['state'] = signInfo[j]['SigninState'];
                  break;
                }
              }
              var studentNo = (i + 1).toString();
              studentList[i]['studentNo'] = studentNo[1] ? studentNo : '0' + studentNo;
              if (!studentList[i]['state']) {
                studentList[i]['state'] = 'absent';
                stat[2] = stat[2] + 1;
              }
              else if (studentList[i]['state'] == 'ontime')
                stat[0] = stat[0] + 1;
              else if (studentList[i]['state'] == 'late')
                stat[1] = stat[1] + 1;
              else if (studentList[i]['state'] == 'leave')
                stat[3] = stat[3] + 1;
            }
            that.setData({
              studentList: studentList,
              stat: stat
            });
          }
        });
      }
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