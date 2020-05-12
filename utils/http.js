module.exports = {
  request(option, isOpenLoading, isCloseLoading) {
    var promise = new Promise((resolve, reject) => {
      //提示一下
      if (isOpenLoading || isOpenLoading == undefined) {
        wx.showLoading({
          title: '加载中...'
        });
      }
      //网络请求
      wx.request({
        ...option,
        timeout: 5000,
        success: function(res) {
          //服务器返回数据
          if (res.statusCode == 200) {
            resolve(res);
          } else {
            //返回错误提示信息
            reject(res.data);
          }
        },
        fail: function(e) {
          wx.showToast({
            title: '请求网络出错',
            icon: 'loading',
            duration: 1000
          });
          reject('请求网络出错');
        },
        complete: function(){
          if (isCloseLoading || isCloseLoading == undefined)
            wx.hideLoading();
        }
      })
    });
    return promise;
  }
}