// pages/interaction/index.js
const util = require('../../utils/util.js')
const http = require('../../utils/http.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    condition: false,
    isSelectClass: false,
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

  courseOut: function() {
    this.setData({
      courseType: 2
    });
  },

  courseOn: function() {
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

  closeSelectClass: function() {
    this.setData({
      isSelectClass: false
    })
  },

  openSelectClass: function() {
    this.setData({
      isSelectClass: true
    })
  },

  changeClass: function(e) {
    this.setData({
      currentClassGuid: this.data.classList[e.currentTarget.dataset.index].PK_ClassGuid,
      courseType: 1,
      isSelectClass: false
    });
    this.getClass();
  },

  joinClass: function(e) {
    var that = this;
    if (e.detail.value.Code == '') {
      wx.showToast({
        title: '请输入班级邀请码',
        icon: 'none'
      })
    } else if (e.detail.value.Code.length < 8) {
      wx.showToast({
        title: '班级邀请码为8位',
        icon: 'none'
      })
    } else {
      http.request({
        url: 'https://codeserver.lessonplan.cn/api/search?text=' + e.detail.value.Code
      }).then(function(res) {
        if (res.data.status == 1) {
          wx.redirectTo({
            url: '/pages/names/join?classId=' + res.data.data.FK_ClassGuid,
          });
        } else {
          wx.showToast({
            title: res.data.err,
            icon: 'none'
          })
        }
      });
    }
  },

  getRecord: function() {
    var that = this;
    let resCords = null;
    http.request({
      url: 'https://codeserver.lessonplan.cn/api/record/' + that.data.currentClassGuid
    }).then(function(res) {
      resCords = res.data.data;
      return http.request({
        url: 'https://templateserver.lessonplan.cn/MyPacket/substance/' + that.data.currentClassGuid
      });
    }).then(function(res3) {
      var records = [];
      var MyCoursewareGuidList = [];
      for (var i = 0; i < resCords.length; i++) {
        if (resCords[i].FK_AppClassGuid != '' && resCords[i].Style != '') {
          //过滤老的签到
          if (resCords[i].Type == 'signIn' && resCords[i].ClientAddress.indexOf('https://clientqrcode.lessonplan.cn') > -1)
            continue;
          resCords[i].Style = JSON.parse(resCords[i].Style);
          resCords[i].CreateTime = util.formatDate(new Date(resCords[i].CreateTime * 1000));
          var courseItem = '"' + resCords[i].FK_MyCoursewareGuid + '"';
          resCords[i]['itemName'] = '';
          if (resCords[i].PageNumber)
            resCords[i]['itemName'] += 'P' + resCords[i].PageNumber.toString();
          if (resCords[i].Style.typeName)
            resCords[i]['itemName'] += '[' + resCords[i].Style.typeName.replace('扫码互动-', '') + ']';
          if (resCords[i].Title)
            resCords[i]['itemName'] += resCords[i].Title;
          else
            resCords[i]['itemName'] += '未命名';
          records.push(resCords[i]);
          if (resCords[i].FK_MyCoursewareGuid && MyCoursewareGuidList.indexOf(courseItem) == -1)
            MyCoursewareGuidList.push(courseItem);
        }
      }
      records.sort(util.compare('PageNumber'));
      if (MyCoursewareGuidList.length > 0) {
        var MyCoursewareGuidListString = MyCoursewareGuidList.join(',');
        http.request({
          url: 'https://templateserver.lessonplan.cn/MyCourseware/MyCoursewareByGuidList',
          data: {
            'MyCoursewareGuidList': MyCoursewareGuidListString
          }
        }).then(function(res2) {
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
            courseList2.push({
              'PK_MyCoursewareGuid': '0',
              'Title': '其它推送',
              'records': elseRecord
            });
          }
          that.setData({
            courseList: courseList,
            courseList2: courseList2,
            pushCount: pushCount,
            pushCount2: pushCount2,
            weCourseList: res3.data.data
          });
        });
      } else {
        var elseRecord = [];
        var pushCount2 = 0;
        for (var m = 0; m < records.length; m++) {
          if (!records[m].FK_MyCoursewareGuid) {
            elseRecord.push(records[m]);
            pushCount2++;
          }
        }
        var courseList2 = [];
        if (elseRecord.length > 0) {
          courseList2.push({
            'PK_MyCoursewareGuid': '0',
            'Title': '其它推送',
            'records': elseRecord
          });
        }
        that.setData({
          courseList2: courseList2,
          pushCount2: pushCount2,
          courseType: 2,
          weCourseList: res3.data.data
        });
      }
    });
  },

  goApp: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var count = e.currentTarget.dataset.count;
    var listIndex = e.currentTarget.dataset.listindex;
    var recordItem = listIndex == 2 ? this.data.courseList2[count].records[index] : this.data.courseList[count].records[index];
    if (recordItem.ClientAddress.indexOf('https://clientqrcode.lessonplan.cn') > -1 || recordItem.ClientAddress.indexOf('https://clientsignin.lessonplan.cn') > -1) {
      wx.showLoading({
        title: '加载中...',
      });
      var detailUrl = 'https://qrcodeserver.lessonplan.cn/';
      if (recordItem['Type'] == 'signIn')
        detailUrl = 'https://signinserver.lessonplan.cn/signin/';
      wx.request({
        url: detailUrl + recordItem.Guid,
        success: function(res) {
          if (res.data.status == 1) {
            var obj = recordItem['Type'] == 'signIn' ? res.data.signinInfo : res.data.data;
            obj['className'] = that.data.currentClassName;
            app.globalData.hdObj[recordItem.Guid] = obj;
            var url = '/hdPages/sign/index?id=' + recordItem.Guid;
            if (recordItem['Type'] != 'signIn')
              url = '/hdPages/' + obj['Type'] + '/index?id=' + recordItem.Guid
            //验证是否提交过
            if (recordItem['Type'] == 'signIn') {
              wx.request({
                url: 'https://signinserver.lessonplan.cn/submitState?signinGuid=' + recordItem.Guid + '&studentGuid=' + app.globalData.userGuid,
                success: function(signRes) {
                  wx.hideLoading();
                  if (signRes.data.status == 0) {
                    url = '/hdPages/sign/success?id=' + recordItem.Guid + '&status=1';
                  }
                  wx.navigateTo({
                    url: url,
                  });
                }
              });
            } else {
              wx.request({
                url: 'https://qrcodeserver.lessonplan.cn/submitcheck',
                data: {
                  'interactGuid': recordItem.Guid,
                  'creatorGuid': app.globalData.userGuid,
                  'type': obj.Type
                },
                method: 'POST',
                success: function(res) {
                  wx.hideLoading();
                  if (res.data.status == -1) {
                    url = '/hdPages/' + obj['Type'] + '/success?id=' + recordItem.Guid + '&status=1';
                  }
                  wx.navigateTo({
                    url: url,
                  });
                }
              });
            } //检查是否已经提交过
          }
        }
      });
    } else {
      wx.navigateTo({
        url: '/pages/index/appview?url=' + recordItem.address,
      })
    }
  },

  goVideo: function(e) {
    var index = e.currentTarget.dataset.index;
    var obj = this.data.weCourseList[index];
    app.globalData.videoObj = obj;
    wx.navigateTo({
      url: '/pages/video/index',
    })
  },

  getClass: function() {
    var that = this;
    http.request({
      url: 'https://clientaccountserver.lessonplan.cn/user/joined/' + app.globalData.userGuid
    }).then(function(res) {
      var hasClass = res.data.data.length > 0 ? true : false;
      that.setData({
        hasClass: hasClass
      });
      if (hasClass) {
        var classListString = [];
        for (var i = 0; i < res.data.data.length; i++) {
          classListString.push('"' + res.data.data[i].FK_ClassGuid + '"');
        }
        http.request({ url: 'https://rosterserver.lessonplan.cn/class/private?classListString=' + classListString.join(',')}).then(function(res2){
          let classList = res2.data.data;
          let currentClassName = null;
          let currentClassGuid = null;
          if (that.data.currentClassGuid) {
            let currentClass = classList.find(item => { return item.PK_ClassGuid == that.data.currentClassGuid});
            if (currentClass){
              currentClassName = currentClass.ClassName;
              currentClassGuid = currentClass.PK_ClassGuid;
            }
          }
          if (!currentClassGuid) {
            currentClassName = classList[0].ClassName;
            currentClassGuid = classList[0].PK_ClassGuid;
          }
          that.setData({
            classList: res2.data.data,
            currentClassName: currentClassName,
            currentClassGuid: currentClassGuid
          });
          that.getRecord();
        });
      }
    });
  },

  checkInfo() {
    if (app.globalData.userInfo && app.globalData.userInfo.Msg && app.globalData.userInfo.NickName && app.globalData.userInfo.School && app.globalData.userInfo.StudentID && app.globalData.userInfo.Major && app.globalData.userInfo.AdministrativeClass && app.globalData.userInfo.Phone && app.globalData.userInfo.Email && app.globalData.userInfo.Msg != '' && app.globalData.userInfo.NickName != '' && app.globalData.userInfo.School != '' && app.globalData.userInfo.StudentID != '' && app.globalData.userInfo.Major != '' && app.globalData.userInfo.AdministrativeClass != '' && app.globalData.userInfo.Phone != '' && app.globalData.userInfo.Email != '')
      return true;
    else
      return false;
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
    var isInfo = this.checkInfo();
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
    var isInfo = this.checkInfo();
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
    this.getClass();
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