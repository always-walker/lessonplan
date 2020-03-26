// pages/test/index.js
const http = require('../../utils/http.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let data1 = null;
    http.request({
      url: 'https://codeserver.lessonplan.cn/api/search',
      data: {
        text: '201202038'
      }
    }).then(function(res) {
      console.log(res.data);
      data1 = res.data.err;
      let text = res.data.status + '0120208';
      console.log(text);
      return http.request({
        url: 'https://codeserver.lessonplan.cn/api/search',
        data: {
          text: text
        }
      })
    }).then(function(res) {
      console.log(data1);
      console.log(res.data);
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