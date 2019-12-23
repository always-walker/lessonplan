const Lock = require('../../utils/gesture_lock.js');
const util = require('../../utils/util.js');
const qqMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
const app = getApp()

Page({
  data: {
    id: null,
    obj: null,
    width: 0,
    leftSecond: 120,
    leftTimeStr: '00:02:00',
    curPassword: null,
    myLocation: '',
    passwords: [
      [1, 2, 3],
      [1, 4, 7],
      [1, 2, 5],
      [1, 2, 4],
      [1, 4, 5],
      [1, 4, 2],
      [1, 4, 8],
      [1, 5, 6],
      [1, 5, 7],
      [1, 4, 8]
    ]
  },

  recordTime: function() {
    var that = this;
    var n = Math.floor(Math.random() * 10);
    that.lock.init('#DF5B98', that.data.passwords[n]);
    that.setData({
      curPassword: that.data.passwords[n].join('')
    });
    that.intervalSet = setInterval(function() {
      let leftSecond = that.data.leftSecond - 1;
      if (leftSecond < 0) {
        var n = Math.floor(Math.random() * 10);
        that.lock.init('#DF5B98', that.data.passwords[n]);
        that.setData({
          leftSecond: 120,
          leftTimeStr: '00:02:00',
          curPassword: that.data.passwords[n].join('')
        });
      } else {
        var leftTimeStr = '00:02:00';
        if (leftSecond < 60)
          leftTimeStr = '00:00:' + util.formatNumber(leftSecond);
        else if (leftSecond < 120)
          leftTimeStr = '00:01:' + util.formatNumber(leftSecond - 60);
        that.setData({
          leftSecond: leftSecond,
          leftTimeStr: leftTimeStr
        });
      }
    }, 1000);
  },

  onLoad: function(options) {
    var id = options.id;
    var obj = app.globalData.hdObj[id];
    const dRes = wx.getSystemInfoSync();
    var width = dRes.windowWidth - 30;
    this.setData({
      id: id,
      obj: obj,
      width: width,
    });
    var that = this;
    this.lock = new Lock("id-gesture-lock",
      wx.createCanvasContext("id-gesture-lock"),
      function(checkPoints, isCancel) {
        var passwords = [];
        for (var i = 0; i < checkPoints.length; i++) {
          passwords.push(checkPoints[i].index);
        }
        if (that.data.curPassword == passwords.join('')) {
          var data = {
            'name': app.globalData.userInfo.NickName,
            'creatorGuid': app.globalData.userGuid,
            'verifyStatus': that.data.obj.InteractVerifyStatus
          };
          wx.showLoading({
            title: '签到中...',
          });
          wx.request({
            url: 'https://qrcodeserver.lessonplan.cn/' + that.data.id + '/sign',
            data: data,
            method: 'POST',
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
          });
        } else {
          that.lock.gestureError();
          setTimeout(function() {
            that.lock.reset();
          }, 2000);
        }
      }, {
        width: width,
        height: width,

      });
    //this.lock.drawGestureLock();
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

  onTouchStart: function(e) {
    this.lock.onTouchStart(e);
  },
  onTouchMove: function(e) {
    this.lock.onTouchMove(e);
  },
  onTouchEnd: function(e) {
    this.lock.onTouchEnd(e);
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
    wx.showLoading({
      title: '加载中...',
    })
    var that = this;
    setTimeout(function() {
      that.recordTime();
      wx.hideLoading();
    }, 1000);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    clearInterval(this.intervalSet);
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