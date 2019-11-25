// pages/my/basic.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    sexs: ['男', '女'],
    index: -1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (!app.globalData.userGuid) {
      wx.redirectTo({
        url: '/pages/login/index',
      });
      return;
    }
    var index = -1;
    if (app.globalData.userInfo.Sex){
      for (var i = 0; i < this.data.sexs.length; i++){
        if (this.data.sexs[i] == app.globalData.userInfo.Sex){
          index = i;
          break;
        }
      }
    }
    this.setData({
      userInfo: app.globalData.userInfo,
      index: index
    });
  },

  bindSexChange: function(e) {
    this.setData({
      index: e.detail.value
    });
  },

  modify: function(e) {
    var data = e.detail.value;
    data['PK_UserGuid'] = app.globalData.userGuid;
    if (this.data.index < 0)
      data['Sex'] = null;
    else
      data['Sex'] = this.data.sexs[this.data.index];
    wx.showLoading({
      title: '更新中...',
    });
    wx.request({
      url: 'https://clientaccountserver.lessonplan.cn/user/info',
      data: data,
      method: 'PUT',
      success: function(res2) {
        if (res2.data.status == 1) {
          wx.request({
            url: 'https://clientaccountserver.lessonplan.cn/user/usermsg/' + app.globalData.userGuid,
            success: function(res) {
              if (!res.data.data.HeadPhotoPath)
                res.data.data.HeadPhotoPath = 'https://cdn.lessonplan.cn/Public/IMG/default-avatar.png';
              if (!res.data.data.Msg)
                res.data.data.Msg = '未填写个性签名';
              app.globalData.userInfo = res.data.data;
              wx.setStorage({
                key: 'userInfo',
                data: res.data.data
              });
              wx.hideLoading();
              wx.showToast({
                title: '更新成功',
              })
            }
          })
        } else {
          wx.hideLoading();
          wx.showToast({
            title: '更新失败..',
            icon: 'none',
          })
        }
      }
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