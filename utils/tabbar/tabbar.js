// utils/tabBar/tabbar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    index: {
      type: String,
      value: 1
    },
    back: {
      type: String,
      value: 1
    },
    isinfo: {
      type: Boolean,
      value: true
    },
    ishome: {
      type: String,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    index: 1,
    back: 1,
    isinfo: true,
    ishome: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    interaction: function (e){
      wx.switchTab({ url: '/pages/index/index' })
    },
    my: function (e) {
      wx.switchTab({ url: '/pages/my/index' })
    },
    joinclass: function(e){
      wx.switchTab({ url: '/pages/index/join' })
    },
    back: function(e) {
      if (this.data.back == 1) {
        wx.navigateBack({
          delta: 1
        })
      }
    }
  }
})