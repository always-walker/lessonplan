//app.js
const io = require('utils/weapp.socket.io.js');
const http = require('utils/http.js')
App({
  noAuthorCallback: function() {
    wx.switchTab({
      url: '/pages/login/index',
    });
  },
  checkLogin: function(){
    if (!this.globalData.userGuid) {
      wx.switchTab({
        url: '/pages/login/index',
      });
    }
  },

  checkInfo() {
    if (this.globalData.userInfo && this.globalData.userInfo.Msg && this.globalData.userInfo.NickName && this.globalData.userInfo.School && this.globalData.userInfo.StudentID && this.globalData.userInfo.Major && this.globalData.userInfo.AdministrativeClass && this.globalData.userInfo.Phone && this.globalData.userInfo.Email && this.globalData.userInfo.Msg != '' && this.globalData.userInfo.NickName != '' && this.globalData.userInfo.School != '' && this.globalData.userInfo.StudentID != '' && this.globalData.userInfo.Major != '' && this.globalData.userInfo.AdministrativeClass != '' && this.globalData.userInfo.Phone != '' && this.globalData.userInfo.Email != '')
      return true;
    else
      return false;
  },

  onLaunch: function() {
    wx.clearStorageSync()
    //this.globalData.userInfo = wx.getStorageSync('userInfo')
    //this.globalData.token = wx.getStorageSync('token')
    if (this.globalData.userInfo && this.globalData.token) {
      this.globalData.userGuid = this.globalData.userInfo.PK_UserGuid
    }
    //在这里处理登录的情况
    // 登录
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    wx.login({
      success: loginRes => {
        that.globalData.code = loginRes.code;
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        // 获取用户信息
        wx.getSetting({
          success: scopeRes => {
            if (scopeRes.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
              wx.getUserInfo({
                withCredentials: true,
                lang: 'zh_CN',
                success: res => {
                  wx.hideLoading();
                  // 可以将 res 发送给后台解码出 unionId
                  // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                  // 所以此处加入 callback 以防止这种情况
                  if (!res.encryptedData) {
                    that.noAuthorCallback()
                  } else {
                    http.request({
                      method: 'post',
                      url: 'https://clientpassport.lessonplan.cn/wx/wxapp',
                      data: {
                        code: loginRes.code,
                        encryptedData: res.encryptedData,
                        iv: res.iv,
                        nickname: res.userInfo.nickName,
                        headimgurl: res.userInfo.avatarUrl
                      }
                    }).then(function(res) {
                      that.globalData.token = res.data.token
                      that.globalData.userGuid = res.data.userGuid;
                      that.globalData.code = null;
                      http.request({
                        url: 'https://clientaccountserver.lessonplan.cn/user/usermsg/' + res.data.userGuid
                      }).then(infoRes => {
                        if (!infoRes.data.data.HeadPhotoPath)
                          infoRes.data.data.HeadPhotoPath = 'https://cdn.lessonplan.cn/Public/IMG/default-avatar.png';
                        if (infoRes.data.data.HeadPhotoPath.indexOf('http') == -1)
                          infoRes.data.data.HeadPhotoPath = 'https://static.lessonplan.cn' + infoRes.data.data.HeadPhotoPath;
                        that.globalData.userInfo = infoRes.data.data;
                        if (that.userInfoReadyCallback) {
                          that.userInfoReadyCallback(infoRes);
                        }
                      });
                    });
                  }
                },
                fail: res => {
                  wx.hideLoading();
                  that.noAuthorCallback()
                }
              })
            } else {
              wx.hideLoading();
              that.noAuthorCallback()
            }
          },
          fail: res => {
            wx.hideLoading();
            that.noAuthorCallback()
          }
        }) //登录处理完毕
      },
      fail: res => {
        wx.hideLoading();
        that.noAuthorCallback()
      }
    })
  },
  globalData: {
    code: null,
    userInfo: null,
    userGuid: null,
    token: null,
    isFindPasswordVerfy: false,
    videoObj: null,
    hdObj: {}
  },
  sendSocket: function(interactGuid) {
    const socket = io('wss://io.lessonplan.cn/');
    socket.emit('interact', {
      interactGuid
    });
  }
})