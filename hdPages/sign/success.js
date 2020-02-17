// hdPages/Discuss/success.js
const qqMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
const util = require('../../utils/util.js');

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    myLocation: '',
    curTime: '',
    signTip: '已签'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var id = options.id;
    var obj = app.globalData.hdObj[id];
    var that = this;
    wx.request({
      url: 'https://signinserver.lessonplan.cn/signinResult/' + id,
      success: function (res) {
        var meSign = res.data['signinResultList'].find(item => {
          return item.FK_StudentGuid == app.globalData.userGuid
        });
        let signTime = util.formatTime2(new Date(meSign['SubmitTime']));
        that.setData({
          id: id,
          curTime: signTime
        });
      }
    })
    var qqMap = new qqMapWX({
      key: 'L2XBZ-2CQRD-M2Z4C-HTN4V-QDFYK-2FB7A'
    });
    //小程序api获取当前坐标
    wx.getLocation({
      success: function(res) {
        qqMap.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function(res) {
            that.setData({
              myLocation: res.result.address
            });
          },
          fail: function(res) {
            console.log('获取当前地址失败');
          }
        });
      },
    })
  },

  goResult: function() {
    var that = this;
    wx.navigateTo({
      url: 'result?id=' + that.data.id,
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