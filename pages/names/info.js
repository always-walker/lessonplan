// pages/names/info.js
const util = require('../../utils/util.js')
const app = getApp()
const http = require('../../utils/http.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    studentList: [],
    isInfo: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      userInfo: app.globalData.userInfo
    });
    var isInfo = app.checkInfo();
    this.setData({
      isInfo: isInfo
    });
    var that = this;
    http.request({
      url: 'https://clientaccountserver.lessonplan.cn/user/studentlist/letter/' + options.classId
    }, false, false).then(function(res) {
      var studentList = res.data.data;
      studentList.sort(util.compare('letter'));
      var preLetter = '';
      for (var i = 0; i < studentList.length; i++) {
        if (studentList[i].letter != preLetter) {
          preLetter = studentList[i].letter;
          studentList[i]['isLetter'] = true;
        } else {
          studentList[i]['isLetter'] = false;
        }
        if (!studentList[i].HeadPhotoPath)
          studentList[i].HeadPhotoPath = 'https://cdn.lessonplan.cn/Public/IMG/default-avatar.png';
        else if (!(/^http.*$/.test(studentList[i].HeadPhotoPath)))
          studentList[i].HeadPhotoPath = 'https://static.lessonplan.cn' + studentList[i].HeadPhotoPath;
      }
      that.setData({
        studentList: studentList
      });
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