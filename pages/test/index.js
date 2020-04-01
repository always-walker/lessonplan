// pages/test/index.js
const http = require('../../utils/http.js')
const regeneratorRuntime = require('../../utils/runtime.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.test();
  },

  test: async function(){
    let res = await http.request({
      url: 'https://codeserver.lessonplan.cn/api/search',
      data: {
        text: '201202038'
      }
    });
    this.setData({
      text: res.data.err
    });
    console.log('搞定');
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