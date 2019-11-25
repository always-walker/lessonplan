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
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    index: 1,
    back: 1
  },

  /**
   * 组件的方法列表
   */
  methods: {
    interaction: function(e) {
      if (this.data.index != 1) {
        let pages = getCurrentPages().reverse();
        let myIndex = 0;
        for (var i = 0; i < pages.length; i++) {
          if (pages[i].route == 'pages/interaction/index')
            myIndex = i;
        }
        if (myIndex > 0) {
          wx.navigateBack({
            delta: myIndex
          })
        } else {
          wx.navigateTo({
            url: '/pages/interaction/index'
          });
        }
      }
    },
    my: function(e) {
      if (this.data.index != 4) {
        let pages = getCurrentPages().reverse();
        let myIndex = 0;
        for (var i = 0; i < pages.length; i++) {
          if (pages[i].route == 'pages/my/index')
            myIndex = i;
        }
        if (myIndex > 0) {
          wx.navigateBack({
            delta: myIndex
          })
        } else {
          wx.navigateTo({
            url: '/pages/my/index'
          });
        }
      }
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