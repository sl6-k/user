// pages/cart/orderCheckout/orderCheckout.js
var util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    MemberOrderID: "", //订单ID
    OrderID: "", //订单编号
    MemberOrderInfo: null, //订单ID
  },
  /**
   * 获取订单详情
   */
  GetMemberOrderDetails: function() {
    let that = this;
    wx.redirectTo({
      url: '../orderDetail/orderDetail?OrderID=' + that.data.OrderID,
    });
  },

  /**
   * 返回首页
   */
  ReturnIndex: function() {
    
    let that = this;
    wx.switchTab({
      url: '../../home/index/index',
    });
  },

  /**
   * 获取会员订单信息
   */
  GetMemberOrder: function() {
    let that = this;
    wx.showLoading({
      title: '正在加载...',
    })
    var param = {
      UserID: wx.getStorageSync('UserID'), //用户ID
      MemberOrderID: that.data.OrderID, //订单编号
      OrderNo:'',
    }
    console.log("订单详情参数", param)
    util.ajaxRequest('/AppApiUser/MemberOrder/MemberOrderEdit', 'POST', param,
      function(res) {
        //隐藏-加载中
        wx.hideLoading();
        if (res.data.ERROR_CODE == "-1") {
          //填充订单对象
          that.setData({
            MemberOrderInfo: res.data.DATA
          });
        }
      });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("提交订单页参数", JSON.stringify(options))
    if (options.OrderID.length > 0) {
      this.setData({
        OrderID: options.OrderID
      });
    }
    this.GetMemberOrder();//获取订单详情
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


})