// hdPages/Discuss/result.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    discussInfo: null,
    images: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var id = options.id;
    var obj = app.globalData.hdObj[id];
    wx.request({
      url: 'https://qrcodeserver.lessonplan.cn/'+ id +'/' + obj.Type,
      success: function(res){
        var imagesArr = [];
        var discussInfo = res.data.discussInfo;
        for (var i = 0; i < discussInfo.length; i++){
          if (discussInfo[i].Content.indexOf(';widthimgs;[') > -1){
            var images = JSON.parse(discussInfo[i].Content.substring(discussInfo[i].Content.lastIndexOf(';widthimgs;')).replace(';widthimgs;', ''));
            var content = discussInfo[i].Content.substring(0, discussInfo[i].Content.lastIndexOf(';widthimgs;'));
            discussInfo[i]['images'] = images;
            discussInfo[i].Content = content;
            imagesArr = imagesArr.concat(images);
          }
          else{
            discussInfo[i]['images'] = [];
          }
        }
        that.setData({
          id: id,
          discussInfo: discussInfo,
          images: imagesArr
        });
      }
    })
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

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