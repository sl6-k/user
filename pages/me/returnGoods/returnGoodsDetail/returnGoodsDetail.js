// pages/me/returnGoods/returnGoodsDetail/returnGoodsDetail.js
var util = require("../../../../utils/util.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    OrderID: null, //订单ID
    MemberOrderInfo: null, //订单信息
    add: "", //获取订单详情
  },
  /**
   * 获取收货地址
   */
  GetStoresAddress: function() {
    let that = this;
    var param = {
      Name: 'StoreAddress'
    }
    console.log("参数" + JSON.stringify(param));
    util.ajaxRequest('/AppApiUser/MemberOrder/GetSystemConfig', 'POST', param,
      function(res) {
        if (res.data.ERROR_CODE == -1) {
          console.log("退货详情地址" + JSON.stringify(res.data));
          //隐藏-加载中
          that.setData({
            add: res.data.DATA
          }); //订单信息
        }
      });
  },
  /**
   * 打开客服
   */
  bindService: function() {
    wx.navigateTo({
      url: '/pages/me/service/service',
    })
  },

  /**
   * 拨打电话
   */
  bindMakePhone: function() {
    var phoneNumber = this.data.MemberOrderInfo.StoresPhone;
    if (phoneNumber == "" || phoneNumber == undefined) {
      wx.showToast({
        title: '此门店无联系电话',
        icon: 'error',
        duration: 2000
      })
    } else {
      wx.makePhoneCall({
        phoneNumber: phoneNumber // 仅为示例，并非真实的电话号码
      });
    }
  },
  /**
   * 获取订单详情信息
   */
  GetOrderDetails: function() {
    let that = this;
    var param = {
      MemberOrderID: that.data.OrderID,
      OrderNo: that.data.orderNo
    }
    wx.showLoading({
      title: '正在加载...',
    })
    console.log("参数" + JSON.stringify(param));
    util.ajaxRequest('/AppApiUser/MemberOrder/MemberOrderEdit', 'POST', param,
      function(res) {
        console.log("订单详情数据" + JSON.stringify(res))
        //隐藏-加载中
        wx.hideLoading();
        that.setData({
          MemberOrderInfo: res.data.DATA
        }); //订单信息
      });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("页面传递的参数是：" + JSON.stringify(options));
    if (options.OrderID != "" && options.orderNo != "") {
      this.setData({
        OrderID: options.OrderID, //订单ID
        orderNo: options.orderNo, //订单编号
      })
    }
    this.GetOrderDetails(); //加载订单信息
    this.GetStoresAddress(); //获取地址
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