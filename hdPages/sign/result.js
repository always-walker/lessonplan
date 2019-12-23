// hdPages/Discuss/result.js

const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    studentList: null,
    stat: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var id = options.id;
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
      url: 'https://qrcodeserver.lessonplan.cn/' + that.data.id + '/sign',
      success: function(res) {
        var signInfo = res.data.signInfo;
        wx.request({
          url: 'https://clientaccountserver.lessonplan.cn/user/studentlist/letter/' + res.data.interactInfo.FK_ClassGuid,
          success: function(res2) {
            wx.hideLoading();
            var studentList = res2.data.data;
            var signCount = 0;
            var noSignCount = 0;
            for (var i = 0; i < studentList.length; i++) {
              var isSign = false;
              for (var j = 0; j < signInfo.length; j++) {
                if (studentList[i].PK_UserGuid == signInfo[j].FK_CreatorGuid) {
                  isSign = true;
                  break;
                }
              }
              var studentNo = (i + 1).toString();
              studentList[i]['isSign'] = isSign;
              studentList[i]['studentNo'] = studentNo[1] ? studentNo : '0' + studentNo;
              if (isSign)
                signCount++;
              else
                noSignCount++;
            }
            that.setData({
              studentList: studentList,
              stat: [signCount, 0, noSignCount, 0]
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