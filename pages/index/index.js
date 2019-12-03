// pages/interaction/index.js
const util = require('../../utils/util.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    condition: false,
    hasClass: false,
    isInfo: false,
    classList: [],
    courseType: 1,
    currentClassName: '',
    currentClassGuid: null,
    courseList: [],
    courseList2: [],
    weCourseList: [],
    pushCount: 0,
    pushCount2: 0,
    scrollHeight: 0
  },

  courseOut: function(){
    this.setData({
      courseType: 2
    });
  },

  courseOn: function () {
    this.setData({
      courseType: 1
    });
  },

  redirectIn: function() {
    this.setData({
      isInfo: true
    });
  },

  searchClass: function(e) {
    this.setData({
      condition: true
    })
  },

  closeSearchClass: function(e) {
    this.setData({
      condition: false
    })
  },

  joinClass: function(e) {
    var that = this;
    if (e.detail.value.Code == '') {
      wx.showToast({
        title: '请输入班级邀请码',
        icon: 'none'
      })
    } else {
      wx.showLoading({
        title: '加载中...',
      });
      wx.request({
        url: 'https://codeserver.lessonplan.cn/api/search?text=' + e.detail.value.Code,
        success: function(res) {
          if (res.data.status == 1) {
            wx.request({
              url: 'https://rosterserver.lessonplan.cn/class/join2',
              method: 'POST',
              data: {
                FK_UserGuid: app.globalData.userGuid,
                FK_ClassGuid: res.data.data.FK_ClassGuid
              },
              success: function(res2) {
                wx.hideLoading();
                if (res2.data.status == 1) {
                  that.setData({
                    condition: false,
                    currentClassGuid: res.data.data.FK_ClassGuid
                  });
                  that.getClass();
                } else if (res2.data.status == 0) {
                  that.setData({
                    condition: false,
                    currentClassGuid: res.data.data.FK_ClassGuid
                  });
                  that.getClass();
                }
              }
            })
          } else {
            wx.hideLoading();
            wx.showToast({
              title: res.data.err,
              icon: 'none'
            })
          }
        }
      })
    }
  },

  getRecord: function() {
    var that = this;
    wx.request({
      url: 'https://codeserver.lessonplan.cn/api/record/' + that.data.currentClassGuid,
      success: function(res) {
        wx.request({
          url: 'https://templateserver.lessonplan.cn/MyPacket/substance/' + that.data.currentClassGuid,
          success: function(res3){
            var records = [];
            var MyCoursewareGuidList = [];
            for (var i = 0; i < res.data.data.length; i++) {
              if (res.data.data[i].FK_AppClassGuid != '' && res.data.data[i].Style != '') {
                res.data.data[i].Style = JSON.parse(res.data.data[i].Style);
                res.data.data[i].CreateTime = util.formatDate(new Date(res.data.data[i].CreateTime * 1000));
                var courseItem = '"' + res.data.data[i].FK_MyCoursewareGuid + '"';
                res.data.data[i]['itemName'] = res.data.data[i].Style.typeName
                if (res.data.data[i].Title)
                  res.data.data[i]['itemName'] += '-' + res.data.data[i].Title;
                if (res.data.data[i].PageNumber)
                  res.data.data[i]['itemName'] += '-P' + res.data.data[i].PageNumber.toString();
                records.push(res.data.data[i]);
                if (res.data.data[i].FK_MyCoursewareGuid && MyCoursewareGuidList.indexOf(courseItem) == -1)
                  MyCoursewareGuidList.push(courseItem);
              }
            }
            records.sort(util.compare('PageNumber'));
            var MyCoursewareGuidListString = MyCoursewareGuidList.join(',');
            wx.request({
              url: 'https://templateserver.lessonplan.cn/MyCourseware/MyCoursewareByGuidList',
              data: {
                'MyCoursewareGuidList': MyCoursewareGuidListString
              },
              success: function (res2) {
                wx.hideLoading();
                var courseList = res2.data.data;
                var pushCount = 0;
                var pushCount2 = 0;
                for (var n = 0; n < courseList.length; n++) {
                  courseList[n]['records'] = [];
                  for (var m = 0; m < records.length; m++) {
                    if (courseList[n].PK_MyCoursewareGuid == records[m].FK_MyCoursewareGuid) {
                      courseList[n]['records'].push(records[m]);
                      pushCount++;
                    }
                  }
                }
                var elseRecord = [];
                for (var m = 0; m < records.length; m++) {
                  if (!records[m].FK_MyCoursewareGuid) {
                    elseRecord.push(records[m]);
                    pushCount2++;
                  }
                }
                var courseList2 = [];
                if (elseRecord.length > 0) {
                  courseList2.push({ 'PK_MyCoursewareGuid': '0', 'Title': '其它推送', 'records': elseRecord });
                }
                that.setData({
                  courseList: courseList,
                  courseList2: courseList2,
                  pushCount: pushCount,
                  pushCount2: pushCount2,
                  weCourseList: res3.data.data
                });
              }
            })//请求3结束
          }
        })//请求2结束
      }
    })//请求1结束
  },

  goApp: function(e) {
    var index = e.currentTarget.dataset.index;
    var count = e.currentTarget.dataset.count;
    wx.navigateTo({
      url: '/pages/index/appview?url=' + this.data.courseList[count].records[index].address,
    })
  },

  goVideo: function (e) {
    var index = e.currentTarget.dataset.index;
    console.log(index);
  },

  getClass: function() {
    wx.showLoading({
      title: '加载中...',
    });
    var that = this;
    if (that.data.currentClassGuid) {
      var classListString = '"' + that.data.currentClassGuid + '"';
      wx.request({
        url: 'https://rosterserver.lessonplan.cn/class/private?classListString=' + classListString,
        success: function(res2) {
          that.setData({
            classList: res2.data.data,
            currentClassName: res2.data.data[0].ClassName,
            currentClassGuid: res2.data.data[0].PK_ClassGuid
          });
          that.getRecord();
        }
      })
    } else {
      wx.request({
        url: 'https://clientaccountserver.lessonplan.cn/user/joined/' + app.globalData.userGuid,
        success: function(res) {
          var hasClass = res.data.data.length > 0 ? true : false;
          that.setData({
            hasClass: hasClass
          });
          if (hasClass) {
            var classListString = [];
            for (var i = 0; i < res.data.data.length; i++) {
              classListString.push('"' + res.data.data[i].FK_ClassGuid + '"');
            }
            wx.request({
              url: 'https://rosterserver.lessonplan.cn/class/private?classListString=' + classListString.join(','),
              success: function(res2) {
                that.setData({
                  classList: res2.data.data,
                  currentClassName: res2.data.data[0].ClassName,
                  currentClassGuid: res2.data.data[0].PK_ClassGuid
                });
                that.getRecord();
              }
            })
          } else {
            wx.hideLoading();
          }
        }
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (!app.globalData.userGuid) {
      wx.redirectTo({
        url: '/pages/login/index',
      });
      return;
    }
    var isInfo = false;
    if (app.globalData.userInfo && app.globalData.userInfo.Msg && app.globalData.userInfo.Msg != '未填写个性签名')
      isInfo = true;
    this.setData({
      isInfo: isInfo,
      scrollHeight: wx.getSystemInfoSync().windowHeight - 110
    });
    if (options.classId) {
      this.setData({
        currentClassGuid: options.classId,
        hasClass: true
      });
    }
    this.getClass();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var isInfo = false;
    if (app.globalData.userInfo && app.globalData.userInfo.Msg && app.globalData.userInfo.Msg != '未填写个性签名')
      isInfo = true;
    this.setData({
      isInfo: isInfo
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.showLoading({
      title: '加载中...',
    });
    this.getRecord();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
})