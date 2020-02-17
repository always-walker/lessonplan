const Lock = require('../../utils/gesture_lock.js');
Page({
  data: {
    width: 0,
  },
  onLoad: function (options) {
    const dRes = wx.getSystemInfoSync();
    this.setData({
      width: dRes.windowWidth - 30,
    });
    var that = this;
    this.lock = new Lock("id-gesture-lock",
      wx.createCanvasContext("id-gesture-lock"),
      function (checkPoints, isCancel) {
        var passwords = [];
        for (var i = 0; i < checkPoints.length; i++) {
          passwords.push(checkPoints[i].index);
        }
        console.log(passwords);
        that.lock.gestureError();
        setTimeout(function () {
          that.lock.reset();
        }, 1000);
      }, {
        width: that.data.width,
        height: that.data.width,
      });
    this.lock.drawGestureLock();
  },
  onTouchStart: function (e) {
    console.log('start');
    this.lock.onTouchStart(e);
  },
  onTouchMove: function (e) {
    console.log('move');
    this.lock.onTouchMove(e);
  },
  onTouchEnd: function (e) {
    console.log('end');
    this.lock.onTouchEnd(e);
  },

  onReady: function () { },
  onShow: function () { },
  onHide: function () { },
  onUnload: function () { },
  onPullDownRefresh: function () { },
  onReachBottom: function () { },
  onShareAppMessage: function () { },
})