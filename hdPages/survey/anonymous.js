// hdPages/Discuss/anonymous.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    defaultText: '',
    questionList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var questionList = [
      {
        title: '春节前，猪肉价格会不会下跌到原来的价格？',
        inputCount: 0
      },
      {
        title: '你认为在当下应该学文科还是学理科？',
        inputCount: 0
      },
      {
        title: 'fluter 发布之后，还需要学习原生的android和iphone开发吗？',
        inputCount: 0
      }
    ];
    this.setData({
      questionList: questionList
    });
  },
  
  inputChange: function (e) {
    var index = e.currentTarget.dataset.index;
    var questionList = this.data.questionList;
    questionList[index].inputCount = e.detail.value.length;
    this.setData({
      questionList: questionList
    });
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
    this.setData({
      inputCount: 0,
      defaultText: ''
    });
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