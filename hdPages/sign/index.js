const Lock = require('../../utils/gesture_lock.js');
const util = require('../../utils/util.js');
const qqMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
const app = getApp()

Page({
  data: {
    id: null,
    obj: null,
    width: 0,
    myLocation: ''
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
        //console.log(passwords);
        var data = {
          'signinGuid': that.data.id,
          'studentName': app.globalData.userInfo.NickName,
          'studentGuid': app.globalData.userGuid,
          'gestureCode': passwords.join('')
        };
        wx.showLoading({
          title: '签到中...',
        });
        wx.request({
          url: 'https://signinserver.lessonplan.cn/signinResult',
          data: data,
          method: 'POST',
          success: function(res) {
            //console.log(res.data);
            //socket通知后台刷新
            wx.hideLoading();
            if (res.data.status == 1) {
              app.sendSocket(that.data.id);
              wx.redirectTo({
                url: 'success?id=' + that.data.id,
              });
            } else {
              wx.showToast({
                title: '手势密码输入错误',
                icon: 'none',
                duration: 1000
              });
              that.lock.gestureError();
              setTimeout(function() {
                that.lock.reset();
              }, 500);
            }
          }
        });
      }, {
        width: width,
        height: width,

      });
    this.lock.drawGestureLock();
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
  onReady: function() {},

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
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
})