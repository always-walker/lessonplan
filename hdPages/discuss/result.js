// hdPages/Discuss/result.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    showType: 2,
    discussInfo: null,
    images: null,
    isInfo: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    var isInfo = app.checkInfo();
    this.setData({
      id: id,
      isInfo: isInfo
    });
    this.getResult();
  },

  getResult: function(){
    var that = this;
    wx.showLoading({
      title: '加载中...',
    });
    var obj = app.globalData.hdObj[that.data.id];
    wx.request({
      url: 'https://qrcodeserver.lessonplan.cn/' + that.data.id + '/' + obj.Type,
      success: function (res) {
        wx.hideLoading();
        var showType = 1;
        if (res.data.interactInfo.Model == 'waterfall')
          showType = 2;
        var imagesArr = [];
        var discussInfo = res.data.discussInfo;
        for (var i = 0; i < discussInfo.length; i++) {
          if (discussInfo[i].Content.indexOf(';widthimgs;[') > -1) {
            var images = JSON.parse(discussInfo[i].Content.substring(discussInfo[i].Content.lastIndexOf(';widthimgs;')).replace(';widthimgs;', ''));
            var content = discussInfo[i].Content.substring(0, discussInfo[i].Content.lastIndexOf(';widthimgs;'));
            discussInfo[i]['images'] = images;
            discussInfo[i].Content = content;
            imagesArr = imagesArr.concat(images);
          }
          else {
            discussInfo[i]['images'] = [];
          }
        }
        discussInfo.reverse();
        that.setData({
          discussInfo: discussInfo,
          images: imagesArr,
          showType: showType
        });
      }
    })
  },

  onPullDownRefresh: function () {
    this.getResult();
    wx.stopPullDownRefresh();
  },

  previewImage: function(e){
    var url = e.currentTarget.dataset.url;
    var that = this;
    wx.previewImage({
      current: url,
      urls: that.data.images
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})