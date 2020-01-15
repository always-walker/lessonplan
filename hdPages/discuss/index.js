const qiniuUploader = require('../../utils/qiniuUploader-min.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    obj: null,
    imageUrl: null,
    uploadImageClass: 'upload-image',
    inputCount: 0,
    defaultText: '',
    maxInputCount: 800
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var id = options.id;
    var obj = app.globalData.hdObj[id];
    this.setData({
      id: id,
      obj: obj,
    });
  },

  submitForm: function(e) {
    var that = this;
    if (e.detail.value.content == '') {
      wx.showToast({
        title: '请输入你的想法',
        icon: 'none',
        duration: 1000
      });
    } else {
      var data = {
        'name': app.globalData.userInfo.NickName,
        'content': e.detail.value.content,
        'creatorGuid': app.globalData.userGuid,
        'allowResubmission': that.data.obj.AllowResubmission,
        'verifyStatus': that.data.obj.InteractVerifyStatus
      };
      if (that.data.imageUrl) {
        data['content'] += ';widthimgs;' + '["' + that.data.imageUrl + '"]';
      }
      wx.showLoading({
        title: '提交中...',
      });
      wx.request({
        url: 'https://qrcodeserver.lessonplan.cn/' + that.data.id + '/discuss',
        data: data,
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res) {
          //成功之后发送socket更新后台显示
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
      });
    }
  },

  inputChange: function(e) {
    this.setData({
      inputCount: e.detail.value.length
    });
  },

  chooseImage: function(e) {
    var that = this;
    wx.chooseImage({
      count: 1,
      success: function(res) {
        that.setData({
          imageUrl: res.tempFilePaths[0],
          uploadImageClass: 'upload-image-success'
        });
        wx.showLoading({
          title: '上传中...',
        });
        var fsize = res.tempFiles[0].size;
        var fileName = res.tempFiles[0].path.substring(res.tempFiles[0].path.lastIndexOf('/') + 1);
        var upKey = 'IMG/QRCode/' + that.data.obj.CreatorGuid + '/' + that.data.id + '/' + fileName;
        wx.request({
          url: 'https://templateserver.lessonplan.cn/myorderform/havespace?FK_UserGuid=' + that.data.obj.CreatorGuid + '&Fsize=' + fsize,
          success: function(tk) {
            if (tk.data.code == 1) {
              qiniuUploader.upload(res.tempFilePaths[0], res2 => {
                wx.hideLoading();
                that.setData({
                  //注意这中间有个"/"在这上面耽误了半个小时
                  imageUrl: res2.imageURL
                })
              }, (error) => {
                console.log('error' + error)
              }, {
                //这里是你所在大区的地址
                region: 'SCN',
                uploadURL: 'https://upload-z2.qiniup.com/',
                domain: 'https://img.lessonplan.cn/',
                key: upKey,
                uptoken: tk.data.token,
              }, (resJd) => {
                //这里是上传进度
                console.log('进度');
              }) //上传七牛
            } //成功获取token
          }
        }); //请求七牛凭证完毕
      },
    })
  },

  goResult: function(){
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

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