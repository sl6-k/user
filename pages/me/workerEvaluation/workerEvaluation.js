// 提交评论
var util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    score: null, //评分
    evaluateContent: '', //评价内容
    workerInstallOrderID: null, //订单编号
    satisfaction: [{
      name: "非常满意",
      id: 3
    }, {
      name: "满意",
      id: 2
    }, {
      name: "不满意",
      id: 1
    }], //满意程度
  },

  /**
   * 选中评价等级
   */
  changeSex: function(e) {
    var value = e.detail.value
    this.setData({
      score: value
    })
  },

  /**
   * 获取评论内容
   */
  getEvaluateContent: function(e) {
    this.setData({
      evaluateContent: e.detail.value
    });
  },

  /**
   * 提交评论
   */
  bindSubmitEvaluation: function() {
    var workerInstallOrderID = wx.getStorageSync("workerInstallOrderID");
    wx.showLoading({
      title: '正在加载...',
    })
    var param = {
      WorkerInstallOrderID: workerInstallOrderID,
      EvaluateLevel: this.data.score, //评价等级
      EvaluateContent: this.data.evaluateContent, //评价内容
    }
    console.log("提交评论传参：" + JSON.stringify(param));
    util.ajaxRequest('/AppApiUser/MemberOrder/WorkerEvaluate', 'POST', param,
      function(res) {
        if (res.data.ERROR_CODE == "-1") {
          console.log("提交评价：" + JSON.stringify(res.data));
          wx.showToast({
            title: '提交成功，即将返回首页',
            icon: 'none',
            duration: 2000,
            complete: function() {
              wx.reLaunch({
                url: '../../home/index/index'
              });
            }
          })

          //隐藏-加载中
          wx.hideLoading();
          //隐藏-加载中
          wx.hideNavigationBarLoading();
          //停止当前页面下拉刷新
          wx.stopPullDownRefresh();
        } else {
          //错误提示
          wx.showModal({
            showCancel: false,
            content: res.data.ERROR_MESSAGE
          });
          //隐藏-加载中
          wx.hideLoading();
          //停止当前页面下拉刷新
          wx.stopPullDownRefresh();
          //隐藏-加载中
          wx.hideNavigationBarLoading();
        }
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("扫描二维码获取携带的参数是：" + JSON.stringify(options));
    if (options.q) {
      let q = decodeURIComponent(options.q);
      var workerInstallOrderID = util.getQueryString(q, 'workerInstallOrderID');
      console.log("获取的推广码是：" + workerInstallOrderID);
      wx.removeStorageSync("workerInstallOrderID");
      wx.setStorageSync("workerInstallOrderID", workerInstallOrderID);
      var workerInstallOrderID = wx.getStorageInfoSync("workerInstallOrderID");
      //判断是否登录，未登录则跳转到登录页面
      if (!util.whetherLogin()) {
        wx.redirectTo({
          url: '../../login/login/login?WorkerInstallOrderID=' + workerInstallOrderID,
        })
      }
    }
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