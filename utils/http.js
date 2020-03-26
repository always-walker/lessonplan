module.exports = {
  request(option) {
    var promise = new Promise((resolve, reject) => {
      //提示一下
      wx.showLoading({
        title: '加载中'
      });
      //网络请求
      wx.request({
        ...option,
        success: function (res) {
          wx.hideLoading();
          //服务器返回数据
          if (res.statusCode == 200) {
            resolve(res);
          } else {
            //返回错误提示信息
            reject(res.data);
          }
        },
        fail: function (e) {
          wx.hideLoading();
          wx.showToast({
            title: '无法连接服务器',
            icon: 'loading',
            duration: 1000
          })
          reject('网络出错');
        }
      })
    });
    return promise;
  }
}